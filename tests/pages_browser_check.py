"""Browser QA for the four static pages and inactive confirmation fixture.

Requires Python Playwright and Chromium or CHROME. Runs its own local server.
VIGIL_SHOTS can point screenshots outside the checkout.
"""
import asyncio
import http.server
import json
import os
from pathlib import Path
import tempfile
import threading

from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parent.parent
SHOTS = Path(os.environ.get('VIGIL_SHOTS', str(Path(tempfile.gettempdir()) / 'vigil-pages-shots')))
SHOTS.mkdir(parents=True, exist_ok=True)


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, *_):
        pass


async def main():
    server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), QuietHandler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f'http://127.0.0.1:{server.server_port}'
    checks = []
    errors = []
    console_errors = []

    def check(name, value):
        checks.append({'name': name, 'passed': bool(value)})

    try:
        async with async_playwright() as p:
            launch = {'executable_path': os.environ['CHROME']} if os.environ.get('CHROME') else {}
            browser = await p.chromium.launch(**launch)
            for width, height in [(1440, 900), (1366, 768), (1024, 768), (768, 1024), (390, 844), (375, 812)]:
                context = await browser.new_context(viewport={'width': width, 'height': height}, accept_downloads=True)
                page = await context.new_page()
                page.on('pageerror', lambda error: errors.append(str(error)))
                page.on('console', lambda message: console_errors.append(message.text + ' ' + str(message.location.get('url', ''))) if message.type == 'error' else None)
                page.on('response', lambda response: errors.append(f'{response.status} {response.url}') if response.status >= 400 and response.url.startswith(base) else None)
                for route in ['agenda', 'speakers', 'about', 'partners']:
                    response = await page.goto(f'{base}/{route}/', wait_until='domcontentloaded')
                    prefix = f'{width}px /{route}/'
                    check(prefix + ' direct load', response.status == 200)
                    check(prefix + ' title and main', await page.locator('h1').count() == 1 and await page.locator('main').count() == 1)
                    check(prefix + ' no overflow', await page.evaluate('document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1'))
                    check(prefix + ' active nav', await page.locator('nav[aria-label="Main"] [aria-current="page"]').count() == 1)
                    check(prefix + ' local assets', await page.evaluate("""async () => {
                      const images = [...document.images]; images.forEach(img => img.loading = 'eager');
                      await Promise.all(images.map(img => img.decode().catch(() => null)));
                      return images.every(img => img.complete && img.naturalWidth > 0);
                    }"""))
                    if route == 'agenda':
                        names = []
                        for day in range(1, 6):
                            await page.locator(f'#dayTab{day}').click()
                            names.append(await page.locator('#agendaPanel h2').inner_text())
                        check(prefix + ' five agenda days', names == ['Vision', 'Diagnose', 'Challenge', 'Evidence in Practice', 'Blueprint Day'])
                        check(prefix + ' five parallel rooms', await page.locator('.room').count() == 5)
                        await page.locator('#dayTab2').click()
                        await page.select_option('#agendaTrack', 'ai')
                        check(prefix + ' track filter', await page.locator('.track-card:visible').count() == 1)
                        await page.locator('#agendaReset').click()
                        check(prefix + ' reset track', await page.locator('.track-card:visible').count() == 3)
                        await page.select_option('#timezone', 'Australia/Sydney')
                        check(prefix + ' Sydney local time', 'Sydney' in await page.locator('#localTime').inner_text())
                        check(prefix + ' recurring Google calendar', 'RRULE' in await page.locator('[data-calendar-google]').get_attribute('href'))
                        async with page.expect_download() as download:
                            await page.locator('[data-calendar-ics]').click()
                        check(prefix + ' Outlook ICS', (await download.value).suggested_filename.endswith('.ics'))
                        await page.locator('#dayTab5').click()
                        await page.go_back(wait_until='domcontentloaded')
                        check(prefix + ' agenda history', await page.locator('#agendaPanel h2').inner_text() == 'Diagnose')
                        if width == 1440:
                            await page.locator('#dayTab2').focus()
                            await page.keyboard.press('End')
                            check('agenda End key', await page.locator('#agendaPanel h2').inner_text() == 'Blueprint Day')
                            await page.keyboard.press('Home')
                            check('agenda Home key', await page.locator('#agendaPanel h2').inner_text() == 'Vision')
                            await page.keyboard.press('ArrowRight')
                            check('agenda arrow key', await page.locator('#agendaPanel h2').inner_text() == 'Diagnose')
                            await page.goto(f'{base}/agenda/#day-4', wait_until='domcontentloaded')
                            check('agenda direct hash', await page.locator('#agendaPanel h2').inner_text() == 'Evidence in Practice')
                            await page.reload(wait_until='domcontentloaded')
                            check('agenda refresh hash', await page.locator('#agendaPanel h2').inner_text() == 'Evidence in Practice')
                    elif route == 'speakers':
                        host = await page.evaluate("""() => {
                          const image = document.querySelector('.host-feature .portrait');
                          const photo = image.getBoundingClientRect();
                          const bio = image.nextElementSibling.getBoundingClientRect();
                          const directory = document.querySelector('#directoryTitle').getBoundingClientRect();
                          return {width:photo.width,height:photo.height,left:photo.left,
                            directoryLeft:directory.left,horizontalGap:bio.left-photo.right,
                            verticalGap:bio.top-photo.bottom,
                            centreOffset:Math.abs((photo.top+photo.height/2)-(bio.top+bio.height/2)),
                            naturalWidth:image.naturalWidth,naturalHeight:image.naturalHeight};
                        }""")
                        expected_width, expected_height = (180, 225) if width <= 700 else (240, 300)
                        check(prefix + ' compact host portrait', abs(host['width'] - expected_width) <= 1 and abs(host['height'] - expected_height) <= 1 and host['naturalWidth'] > 0)
                        check(prefix + ' host and directory aligned', abs(host['left'] - host['directoryLeft']) <= 1)
                        check(prefix + ' host layout gap', abs((host['verticalGap'] if width <= 700 else host['horizontalGap']) - (24 if width <= 700 else 32)) <= 1)
                        if width > 700:
                            check(prefix + ' host vertically centred', host['centreOffset'] <= 1)
                        named = page.locator('#speakerGrid .speaker-card')
                        announced = page.locator('#speakerTbaGrid .speaker-card')
                        check(prefix + ' ten named and four unannounced cards', await named.count() == 10 and await announced.count() == 4)
                        check(prefix + ' named count', (await page.locator('#speakerCount').inner_text()).strip() == '10 named speakers shown')
                        check(prefix + ' Ike first', await named.first.locator('h3').inner_text() == 'Ike Aigbogun')
                        check(prefix + ' keynote in separate section', await announced.first.locator('h3').inner_text() == 'Keynote speaker')
                        check(prefix + ' rectangular portraits', await page.evaluate("""() =>
                          [...document.querySelectorAll('#speakerGrid .vframe, .host-panel .portrait')]
                            .every(el => getComputedStyle(el).clipPath === 'none')"""))
                        await page.select_option('#speakerDay', '3')
                        await page.select_option('#speakerTrack', 'tools')
                        check(prefix + ' combined day and track', await page.locator('#speakerGrid .speaker-card:visible h3').all_inner_texts() == ['Claudia Soares'])
                        check(prefix + ' filtered named count', (await page.locator('#speakerCount').inner_text()).strip() == '1 named speaker shown')
                        check(prefix + ' unannounced stay separate', await page.locator('#speakerTbaGrid .speaker-card:visible').count() == 4)
                        await page.select_option('#speakerDay', '4')
                        await page.select_option('#speakerTrack', 'data')
                        check(prefix + ' empty result', await page.locator('#speakerEmpty').is_visible())
                        await page.locator('#speakerReset').click()
                        check(prefix + ' filter reset', await page.locator('#speakerGrid .speaker-card:visible').count() == 10)
                    elif route == 'about':
                        check(prefix + ' host anchor', await page.locator('#host').count() == 1)
                        check(prefix + ' experience logos', await page.locator('.logo-plates img').count() == 3)
                    else:
                        check(prefix + ' fifteen current logos', await page.locator('#currentPartners img').count() == 15)
                        check(prefix + ' approved contact', await page.locator('a[href="mailto:ike@wearevigil.global?subject=Partnering%20with%20VIGIL"]').count() == 2)
                    if width <= 960:
                        burger = page.locator('#burger')
                        await burger.click()
                        check(prefix + ' mobile menu opens', await page.locator('#mobileMenu').is_visible() and await burger.get_attribute('aria-expanded') == 'true')
                        await page.keyboard.press('Escape')
                        check(prefix + ' mobile menu Escape', not await page.locator('#mobileMenu').is_visible())
                    if width in (1440, 390):
                        await page.screenshot(path=str(SHOTS / f'{route}-{width}.png'), full_page=True)
                        if route == 'speakers':
                            await page.locator('.host-feature').screenshot(path=str(SHOTS / f'speakers-host-{width}.png'))
                await context.close()

            context = await browser.new_context(viewport={'width': 390, 'height': 844}, accept_downloads=True)
            page = await context.new_page()
            page.on('pageerror', lambda error: errors.append(str(error)))
            page.on('console', lambda message: console_errors.append(message.text + ' ' + str(message.location.get('url', ''))) if message.type == 'error' else None)
            await page.goto(f'{base}/tests/fixtures/thank-you.html?registered=1', wait_until='domcontentloaded')
            check('thank-you direct query stays closed', await page.locator('#vigilThankYou').count() == 0)
            rejected = await page.evaluate("""() => {
              try { window.VigilThankYou.open({verified:false,pass:'free'}); return false; }
              catch (_) { return !document.querySelector('#vigilThankYou'); }
            }""")
            check('thank-you failed registration stays closed', rejected)
            await page.locator('#mockFree').click()
            check('thank-you mock Free opens', await page.locator('#vigilThankYou').is_visible())
            check('thank-you Free upgrade', await page.locator('#vigilThanksUpgrade').is_visible())
            await page.screenshot(path=str(SHOTS / 'thank-you-390.png'))
            await page.keyboard.press('Shift+Tab')
            check('thank-you focus trapped', await page.evaluate('document.activeElement.href?.includes("code=GC647E") === true'))
            await page.locator('#vigilBadgeName').fill('Test Attendee')
            async with page.expect_download() as download:
                await page.locator('#vigilBadgeDownload').click()
            check('thank-you PNG download', (await download.value).suggested_filename == 'VIGIL-2027-attending.png')
            await page.keyboard.press('Escape')
            check('thank-you Escape and focus restore', not await page.locator('#vigilThankYou').is_visible() and await page.evaluate('document.activeElement.id') == 'mockFree')
            await page.locator('#mockVip').click()
            check('thank-you VIP upgrade hidden', not await page.locator('#vigilThanksUpgrade').is_visible())
            await page.locator('.vigil-thanks-close').click()
            check('thank-you close and focus restore', await page.evaluate('document.activeElement.id') == 'mockVip')
            await page.reload(wait_until='domcontentloaded')
            check('thank-you reload stays closed', await page.locator('#vigilThankYou').count() == 0)
            check('browser script errors', len(errors) == 0)
            check('no application console errors', all('fonts.googleapis.com' in error or 'fonts.gstatic.com' in error for error in console_errors))
            await context.close()
            await browser.close()
    finally:
        server.shutdown()
    failed = [item['name'] for item in checks if not item['passed']]
    unexpected_console = [error for error in console_errors if 'fonts.googleapis.com' not in error and 'fonts.gstatic.com' not in error]
    print(json.dumps({'passed': len(checks) - len(failed), 'failed': len(failed), 'failures': failed, 'errors': errors,
                      'unavailable_external_font_requests': len(console_errors) - len(unexpected_console),
                      'unexpected_console_errors': unexpected_console, 'screenshots': str(SHOTS)}, indent=2))
    if failed:
        raise SystemExit(1)


asyncio.run(main())
