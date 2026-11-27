"""Optional browser check (not required to run the site).
Needs: pip install playwright && playwright install chromium  (or set CHROME=/path/to/chrome)
Run a static server from the project folder:  python -m http.server 5501 --bind 127.0.0.1
Then:  python tests/browser_check.py   -> prints JSON results, writes screenshots to ./browser-shots
Returns a nonzero exit code if a verified condition fails. Playwright is a QA-only dependency.
Checks six widths (1440, 1366, 1024, 768, 390, 375): horizontal overflow, countdown ticking and fit,
registration URLs, all five agenda days, Day 5 rooms, mini-Checkpoint flow, FAQ, Outlook .ics download,
Google Calendar link, images, mobile menu, console errors, reduced motion and timeline keyboard keys."""
import asyncio, json, sys, time
from playwright.async_api import async_playwright
import os
URL = os.environ.get('VIGIL_URL', 'http://127.0.0.1:5501/index.html')
OUT = os.environ.get('VIGIL_SHOTS', 'browser-shots'); os.makedirs(OUT, exist_ok=True)
REG = 'https://summit.wearevigil.global/p/register'
DESTINATIONS = {
    'free': REG,
    'heartbeat': REG,
    'vip': 'https://summit.wearevigil.global/invitation?code=GC647E',
    'vipplus': 'https://summit.wearevigil.global/invitation?code=683CEE',
    'corporate': 'https://summit.wearevigil.global/invitation?code=C7GA72',
}
INVOICE = 'mailto:ike@wearevigil.global?subject=Corporate%20Pass%20Invoice%20Request%20%E2%80%93%20VIGIL%20Summit%202027'
results = {}

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(**({'executable_path': os.environ['CHROME']} if os.environ.get('CHROME') else {}))
        for w, h in [(1440, 900), (1366, 768), (1024, 768), (768, 1024), (390, 844), (375, 812)]:
            ctx = await b.new_context(viewport={'width': w, 'height': h}, accept_downloads=True, timezone_id='Europe/London')
            page = await ctx.new_page()
            errs = []
            page.on('console', lambda m: errs.append(m.text + ' ' + str(m.location.get('url',''))) if m.type in ('error', 'warning') else None)
            page.on('pageerror', lambda e: errs.append('PAGEERROR ' + str(e)))
            failed = []
            page.on('requestfailed', lambda r: failed.append(r.url) if '127.0.0.1' in r.url else None)
            await page.goto(URL, wait_until='load')
            await page.evaluate('document.fonts.ready'); await page.wait_for_timeout(600)
            r = {}
            # reveal everything for measurement/screenshots
            await page.evaluate("document.querySelectorAll('.reveal,.tl-stage,#bars').forEach(e=>e.classList.add('in'))")
            r['overflowX'] = await page.evaluate("document.documentElement.scrollWidth - document.documentElement.clientWidth")
            # elements wider than viewport
            # The final CTA mark intentionally bleeds outside its clipped parent.
            # Keep content overflow checks, excluding only known scroll/crop surfaces.
            r['wideEls'] = await page.evaluate("""(()=>{const vw=document.documentElement.clientWidth;const out=[];document.querySelectorAll('body *').forEach(e=>{const b=e.getBoundingClientRect();if(b.width>0&&(b.right>vw+1)&&!e.closest('.marquee,.rail,.day-tabs,.mobile-menu,.hero-visual,.mark-crop'))out.push(e.className.baseVal||e.className||e.tagName)});return [...new Set(out)].slice(0,8)})()""")
            r['flapFits'] = await page.evaluate("(()=>{const a=document.querySelector('.count-area').getBoundingClientRect();const bd=document.querySelector('.count-board').getBoundingClientRect();return bd.right<=a.right+1 && bd.left>=a.left-1})()")
            r['zonesFit'] = await page.evaluate("(()=>{const rows=[...document.querySelectorAll('.zones li')];const expected=[['GMT','2:00 PM – 5:00 PM'],['US Eastern (EST)','9:00 AM – 12:00 PM'],['Gulf (GST)','6:00 PM – 9:00 PM']];return rows.length===3 && rows.every((row,i)=>row.querySelector('span')?.textContent===expected[i][0] && row.querySelector('b')?.textContent===expected[i][1] && row.scrollWidth<=row.clientWidth+1 && [...row.children].every(child=>child.getBoundingClientRect().right<=row.getBoundingClientRect().right+1))})()")
            await page.locator('.timezone-tools summary').click()
            await page.select_option('#tzSelect', 'Australia/Sydney')
            r['sydneyTime'] = await page.evaluate("document.querySelector('#yourTime').textContent")
            await page.locator('.timezone-tools summary').click()
            d1 = await page.evaluate("document.querySelector('#cdS').dataset.value")
            await page.wait_for_timeout(1300)
            d2 = await page.evaluate("document.querySelector('#cdS').dataset.value")
            r['countdownTicks'] = d1 != d2
            r['countdownDays'] = await page.evaluate("document.querySelector('#cdD').dataset.value")
            # registration links
            hrefs = await page.evaluate("[...document.querySelectorAll('a[data-register]')].map(a=>({kind:a.dataset.register,href:a.href}))")
            r['registerLinks'] = len(hrefs)
            r['passLinksCorrect'] = all(x['kind'] in DESTINATIONS and x['href'] == DESTINATIONS[x['kind']] for x in hrefs)
            r['passLinkKinds'] = sorted(set(x['kind'] for x in hrefs))
            r['corporateActions'] = await page.evaluate("""(()=>{const card=[...document.querySelectorAll('.pass')].find(e=>e.querySelector('.pname')?.textContent==='Corporate');const primary=card?.querySelector('a[data-register="corporate"]'),invoice=card?.querySelector('a[href^="mailto:"]');const shown=e=>!!e&&e.getBoundingClientRect().width>0&&e.getBoundingClientRect().height>0;return {cards:[...document.querySelectorAll('.pass')].filter(e=>e.querySelector('.pname')?.textContent==='Corporate').length,primaryText:primary?.textContent.trim(),primaryHref:primary?.href,primaryStyle:primary?.classList.contains('btn-primary'),primaryShown:shown(primary),invoiceText:invoice?.textContent.trim(),invoiceHref:invoice?.href,invoiceShown:shown(invoice)}})()""")
            # agenda: select each day
            mobile = w <= 860
            sel = '#dayTabs [role=tab]' if mobile else '#tlNodes [role=tab]'
            days = []
            for i in range(5):
                await page.locator(sel).nth(i).click()
                await page.wait_for_timeout(120)
                info = await page.evaluate("""(()=>{const p=document.querySelector('#dayPanel');const vw=document.documentElement.clientWidth;let wide=0;p.querySelectorAll('*').forEach(e=>{if(e.getBoundingClientRect().right>vw+1)wide++});
                  return {h:p.querySelector('h3').textContent, rows:p.querySelectorAll('.sched-list>li').length, rooms:p.querySelectorAll('.room').length, when:p.querySelector('.when-line').textContent, note:p.querySelector('.sched-note')?.textContent||'', roomTime:p.querySelector('.rooms-head .sub-h')?.textContent||'', scheduleOpen:p.querySelector('details.sched')?.open??null, cta:p.querySelector('.act a')?.href, wide}})()""")
                days.append(info)
            r['days'] = days
            # Day 5 rooms layout
            await page.locator(sel).nth(4).click(); await page.wait_for_timeout(150)
            r['roomCols'] = await page.evaluate("getComputedStyle(document.querySelector('.rooms')).gridTemplateColumns.split(' ').length")
            el = page.locator('#days')
            nav_capture_style = await page.add_style_tag(content='.nav{position:absolute!important}')
            await el.screenshot(path=f'{OUT}/agenda-day5-{w}.png')
            await page.locator(sel).nth(1).click(); await page.wait_for_timeout(150)
            await el.screenshot(path=f'{OUT}/agenda-day2-{w}.png')
            await nav_capture_style.evaluate('(el) => el.remove()')
            r['navigationFixed'] = await page.evaluate("getComputedStyle(document.querySelector('.nav')).position === 'fixed'")
            # quiz
            for k in range(3):
                await page.locator('#qBody .opt').nth(1 if k < 2 else 0).click()
            r['quizResult'] = await page.evaluate("({hidden:document.querySelector('#qResult').hidden, title:document.querySelector('#rTitle').textContent, focus:document.querySelector('#rPillar').textContent, answers:document.querySelectorAll('#rAnswers li').length, cta:document.querySelector('#rFull').href})")
            await page.locator('#check').screenshot(path=f'{OUT}/checkpoint-{w}.png')
            await page.click('#qRestart')
            r['quizRestart'] = await page.evaluate("document.querySelector('#qLabel').textContent")
            # FAQ
            await page.locator('.faq summary').nth(2).click()
            r['faqOpen'] = await page.evaluate("document.querySelectorAll('.faq details')[2].open")
            await page.locator('.faq summary').nth(2).click()
            r['faqClosed'] = not await page.evaluate("document.querySelectorAll('.faq details')[2].open")
            # Outlook download
            async with page.expect_download() as dl:
                await page.click('#atcIcs')
            d = await dl.value
            path = await d.path(); ics = open(path, encoding='utf-8').read()
            r['ics'] = {'name': d.suggested_filename, 'start': 'DTSTART:20270301T140000Z' in ics, 'rrule': 'RRULE:FREQ=DAILY;COUNT=5' in ics, 'outlookToast': 'Outlook' in await page.evaluate("document.querySelector('#toast').textContent")}
            g = await page.evaluate("document.querySelector('#atcGoogle').href")
            r['google'] = 'dates=20270301T140000Z/20270301T170000Z' in g and g.startswith('https://calendar.google.com/calendar/render') and 'RRULE%3AFREQ%3DDAILY%3BCOUNT%3D5' in g
            # speakers
            r['speakers'] = await page.evaluate("[...document.querySelectorAll('#rail .spk h3')].map(h=>h.textContent)")
            await page.evaluate("document.querySelectorAll('#rail img').forEach(i=>i.loading='eager')")
            await page.wait_for_function("[...document.querySelectorAll('#rail img')].every(i=>i.complete&&i.naturalWidth>0)")
            r['portraitsLoaded'] = await page.evaluate("[...document.querySelectorAll('#rail img')].every(i=>i.complete&&i.naturalWidth>0)")
            await page.click('#railNext')
            await page.wait_for_function("document.querySelector('#rail').scrollLeft > 2 && !document.querySelector('#railPrev').disabled")
            r['speakerNext'] = await page.evaluate("document.querySelector('#rail').scrollLeft > 2 && !document.querySelector('#railPrev').disabled")
            await page.click('#railPrev')
            await page.wait_for_function("document.querySelector('#rail').scrollLeft <= 2 && document.querySelector('#railPrev').disabled")
            r['speakerPrevious'] = await page.evaluate("document.querySelector('#railPrev').disabled")
            # all images loaded after scroll
            await page.evaluate("window.scrollTo(0, document.body.scrollHeight)"); await page.wait_for_timeout(500)
            await page.evaluate("document.querySelectorAll('img[loading=lazy]').forEach(i=>i.loading='eager')"); await page.wait_for_timeout(500)
            await page.wait_for_function("[...document.images].every(i=>i.complete&&i.naturalWidth>0)")
            r['brokenImages'] = await page.evaluate("[...document.images].filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.src)")
            r['sponsorLogos'] = await page.evaluate("""(()=>{const category=[...document.querySelectorAll('.category-logos img')],summit=[...document.querySelectorAll('.pt-logos img')],grid=document.querySelector('.pt-logos');const fits=i=>{const a=i.getBoundingClientRect(),b=i.parentElement.getBoundingClientRect();return i.naturalWidth>0&&a.width>0&&a.height>0&&a.left>=b.left-1&&a.right<=b.right+1&&a.top>=b.top-1&&a.bottom<=b.bottom+1&&Math.abs(a.width/a.height-i.naturalWidth/i.naturalHeight)<.03};const style=i=>{const s=getComputedStyle(i.parentElement);return [s.backgroundColor,s.border,s.borderRadius].join('|')};return {category:category.map(i=>i.alt),summit:summit.map(i=>i.alt),unique:new Set([...category,...summit].map(i=>i.src)).size,fit:[...category,...summit].every(fits),columns:getComputedStyle(grid).gridTemplateColumns.split(' ').length,rows:new Set([...grid.children].map(e=>Math.round(e.getBoundingClientRect().top))).size,sameCardStyle:new Set(summit.map(style)).size===1,haopDark:document.querySelector('.pt-logos img[alt="HAOP logo"]')?.parentElement.classList.contains('dark')}})()""")
            r['experienceLogos'] = await page.evaluate("""(()=>{const imgs=[...document.querySelectorAll('.exp-list img')];return {names:imgs.map(i=>i.alt),loaded:imgs.every(i=>i.naturalWidth>0)}})()""")
            r['logoAlpha'] = await page.evaluate("""(()=>{const imgs=[...document.querySelectorAll('.exp-list img,.category-logos img,.pt-logos img')];const canvas=document.createElement('canvas');const c=canvas.getContext('2d',{willReadFrequently:true});return imgs.every(i=>{canvas.width=i.naturalWidth;canvas.height=i.naturalHeight;c.clearRect(0,0,canvas.width,canvas.height);c.drawImage(i,0,0);return c.getImageData(0,0,1,1).data[3]===0&&c.getImageData(canvas.width-1,canvas.height-1,1,1).data[3]===0})})()""")
            r['companyPlaceholder'] = await page.evaluate("""(()=>{const box=document.querySelector('.company-placeholder');return {heading:document.querySelector('#companyTitle')?.textContent,copy:box?.textContent.trim(),images:box?.querySelectorAll('img').length,carousel:!!document.querySelector('.marquee')}})()""")
            # hover check: speaker card computed filter/colour unchanged
            r['hostImgs'] = await page.evaluate("document.querySelectorAll('.host-v img').length")
            # mobile menu
            if w <= 960:
                await page.evaluate("window.scrollTo(0,0)")
                await page.click('#burger'); await page.wait_for_timeout(300)
                op = await page.evaluate("document.querySelector('#mobileMenu').classList.contains('open')")
                await page.keyboard.press('Escape'); await page.wait_for_timeout(300)
                cl = not await page.evaluate("document.querySelector('#mobileMenu').classList.contains('open')")
                r['mobileMenu'] = op and cl
            # screenshots
            await page.evaluate("window.scrollTo(0,0)"); await page.wait_for_timeout(300)
            await page.screenshot(path=f'{OUT}/top-{w}.png')
            nav_capture_style = await page.add_style_tag(content='.nav{position:absolute!important}')
            for sec in ['#event', '#speakers', '#who', '#passes', '#host', '#partners', '#faq']:
                await page.locator(sec).screenshot(path=f'{OUT}/{sec[1:]}-{w}.png')
            await nav_capture_style.evaluate('(el) => el.remove()')
            if w in (1440, 390):
                await page.screenshot(path=f'{OUT}/full-{w}.png', full_page=True)
            r['consoleErrors'] = errs; r['failedLocal'] = failed
            results[w] = r
            await ctx.close()
        # reduced motion
        ctx = await b.new_context(viewport={'width': 390, 'height': 844}, reduced_motion='reduce')
        page = await ctx.new_page(); await page.goto(URL); await page.wait_for_timeout(1500)
        results['reducedMotion'] = await page.evaluate("({enabled:matchMedia('(prefers-reduced-motion: reduce)').matches, anim:getComputedStyle(document.querySelector('.company-placeholder')).animationName, flipping:document.querySelectorAll('.flap.go').length})")
        await ctx.close()
        # keyboard on timeline
        ctx = await b.new_context(viewport={'width': 1440, 'height': 900}); page = await ctx.new_page(); await page.goto(URL)
        await page.locator('#tlNodes [role=tab]').nth(0).focus(); await page.keyboard.press('End')
        results['keyEnd'] = await page.evaluate("document.querySelector('#dayPanel h3').textContent")
        await page.keyboard.press('Home')
        results['keyHome'] = await page.evaluate("document.querySelector('#dayPanel h3').textContent")
        await ctx.close()
        await b.close()
    # A successful process exit must mean the measured checks actually passed.
    checks = []
    def verify(name, condition):
        checks.append({'name': name, 'passed': bool(condition)})
    names = ['Vision', 'Diagnose', 'Challenge', 'Evidence in Practice', 'Blueprint Day']
    for width, r in results.items():
        if not isinstance(width, int):
            continue
        prefix = f'{width}px '
        verify(prefix + 'document and content fit', r['overflowX'] == 0 and not r['wideEls'])
        for key in ['flapFits', 'countdownTicks', 'zonesFit', 'passLinksCorrect', 'navigationFixed',
                    'faqOpen', 'faqClosed', 'google', 'portraitsLoaded', 'speakerNext', 'speakerPrevious']:
            verify(prefix + key, r[key])
        verify(prefix + 'Sydney local-time conversion', '1:00–4:00am' in r['sydneyTime'] and 'AEDT' in r['sydneyTime'])
        verify(prefix + 'three-digit days', len(r['countdownDays']) == 3)
        verify(prefix + 'registration links present', r['registerLinks'] > 0)
        verify(prefix + 'all pass types linked', r['passLinkKinds'] == sorted(DESTINATIONS))
        actions = r['corporateActions']
        verify(prefix + 'Corporate JOIN NOW and invoice actions', actions['cards'] == 1
               and actions['primaryText'] == 'JOIN NOW' and actions['primaryHref'] == DESTINATIONS['corporate']
               and actions['primaryStyle'] and actions['primaryShown']
               and actions['invoiceText'] == 'Request an Invoice' and actions['invoiceHref'] == INVOICE
               and actions['invoiceShown'])
        for i, day in enumerate(r['days']):
            verify(prefix + f'day {i + 1}', day['h'].startswith(names[i]) and day['wide'] == 0
                   and day['rows'] == [10, 8, 8, 8, 0][i] and day['rooms'] == (5 if i == 4 else 0)
                   and day['when'].endswith('GMT') and (day['scheduleOpen'] is None if i == 4 else day['scheduleOpen'] is False)
                   and day['cta'] == (DESTINATIONS['vip'] if i == 4 else REG))
        verify(prefix + 'five agenda days', len(r['days']) == 5)
        verify(prefix + 'Day 5 compact programme', '14:00–17:00 — Choose a Room' in r['days'][4]['roomTime']
               and '(GMT)' in r['days'][4]['roomTime']
               and 'All five rooms run at the same time' in r['days'][4]['note']
               and 'overview of the rooms you did not attend' in r['days'][4]['note'])
        verify(prefix + 'room columns', r['roomCols'] == (5 if width > 1180 else 3 if width > 760 else 1))
        quiz = r['quizResult']
        verify(prefix + 'Checkpoint result', not quiz['hidden'] and quiz['answers'] == 3
               and quiz['title'] == 'Get your full Checkpoint result.'
               and quiz['cta'].startswith('https://checkpoint.wearevigil.global/'))
        verify(prefix + 'Checkpoint restart', r['quizRestart'] == 'Question 1 of 3')
        verify(prefix + 'Outlook ICS', r['ics']['name'] == 'VIGIL-Summit-2027.ics'
               and all(r['ics'][k] for k in ['start', 'rrule', 'outlookToast']))
        verify(prefix + 'all images healthy', not r['brokenImages'])
        logos = r['sponsorLogos']
        verify(prefix + 'three Category Sponsors', logos['category'] == ['FloCrunch logo', 'nuTheory logo', 'CTS Globe logo'])
        verify(prefix + '12 Summit Partners', logos['summit'] == ['AI in HSE logo', 'HeyLina logo', 'EvexSafety logo', 'FLOWforms logo', 'HAOP logo', 'HSZ Solutions logo', 'KorviaOne logo', 'OwnThePrompt logo', 'QHSE Directory logo', 'SHEDAI logo', 'HSE Nations logo', 'SOWSHE-A logo'])
        verify(prefix + 'sponsor logos fit and share card style', logos['unique'] == 15 and logos['fit'] and logos['sameCardStyle'] and not logos['haopDark'])
        verify(prefix + 'all organisation logos genuinely transparent', r['logoAlpha'])
        expected_columns = 6 if width > 1050 else 4 if width > 640 else 2
        verify(prefix + 'compact responsive sponsor grid', logos['columns'] == expected_columns and logos['rows'] == 12 // expected_columns)
        verify(prefix + 'three experience logos', r['experienceLogos']['names'] == ['Morrisons logo', 'Cority logo', 'Unilever logo']
               and r['experienceLogos']['loaded'])
        company = r['companyPlaceholder']
        verify(prefix + 'In Good Company placeholder', company['heading'] == 'In Good Company'
               and company['copy'] == 'Corporate attendee logos will appear here once confirmed.'
               and company['images'] == 0 and not company['carousel'])
        verify(prefix + 'speaker and host cards', r['speakers'] == [
            'Ike Aigbogun', 'Bulat Almukhametov', 'Sarah Power', 'Funmi Adegbola',
            'Isaac Ochulor', 'Jaina Ko', 'Claudia Soares', 'Subhrajeet Patra',
            'Supriya Naidu', 'Zoe Borde', 'Speaker to be announced',
            'Speaker to be announced', 'Speaker to be announced', 'Keynote speaker'
        ] and r['hostImgs'] == 1)
        verify(prefix + 'console clean', not r['consoleErrors'])
        verify(prefix + 'local requests successful', not r['failedLocal'])
        if width <= 960:
            verify(prefix + 'mobile menu', r['mobileMenu'])
    verify('reduced motion', results['reducedMotion']['enabled'] and results['reducedMotion']['anim'] == 'none'
           and results['reducedMotion']['flipping'] == 0)
    verify('timeline End key', results['keyEnd'].startswith('Blueprint Day'))
    verify('timeline Home key', results['keyHome'].startswith('Vision'))
    failed_checks = [c['name'] for c in checks if not c['passed']]
    results['verification'] = {'passed': len(checks) - len(failed_checks), 'failed': len(failed_checks),
                               'failures': failed_checks, 'checks': checks}
    print(json.dumps(results, indent=1, ensure_ascii=False))
    if failed_checks:
        raise AssertionError('Browser verification failed: ' + ', '.join(failed_checks))
asyncio.run(main())
