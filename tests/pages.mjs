import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const routes = ['agenda', 'speakers', 'about', 'partners'];
const pages = Object.fromEntries(routes.map(route => [route, read(`${route}/index.html`)]));
const free = 'https://summit.wearevigil.global/p/register';
const vip = 'https://summit.wearevigil.global/invitation?code=GC647E';
let count = 0;
function check(name, fn) { fn(); console.log(`PASS ${name}`); count++; }

check('four static routes have main landmarks, a skip link and distinct page titles', () => {
  for (const [route, html] of Object.entries(pages)) {
    assert.match(html, /<main id="main">/);
    assert.match(html, /href="#main">Skip to content/);
    assert.match(html, new RegExp(`<title>${route[0].toUpperCase() + route.slice(1)} · VIGIL Summit 2027</title>`));
    assert.match(html, new RegExp(`<body data-page="${route}">`));
    assert.equal((html.match(/aria-current="page"/g) || []).length, 2);
  }
});
check('new page navigation and cross-links target real local routes', () => {
  for (const html of Object.values(pages)) {
    for (const route of routes) assert.ok(html.includes(`href="/${route}/"`), route);
    assert.doesNotMatch(html, /data-proto=/);
  }
  const home = read('index.html');
  for (const route of routes) assert.ok(home.includes(`href="/${route}/"`), route);
  assert.match(home, /href="\/about\/#host"/);
});
check('every local image, stylesheet, script and SVG favicon exists', () => {
  for (const [route, html] of Object.entries(pages)) {
    for (const match of html.matchAll(/(?:src|href)="(\/assets\/[^"?#]+)"/g)) {
      assert.ok(fs.existsSync(path.join(root, match[1].slice(1))), `${route}: ${match[1]}`);
    }
  }
});
check('all free and VIP page actions use the approved invitations', () => {
  for (const [route, html] of Object.entries(pages)) {
    assert.ok(html.includes(free), route);
    for (const match of html.matchAll(/href="(https:\/\/summit\.wearevigil\.global\/[^\"]+)"/g)) {
      assert.ok([free, vip].includes(match[1]), `${route}: ${match[1]}`);
    }
  }
  assert.ok(read('assets/agenda-page.js').includes(vip));
});
check('speaker directory has combined filters and no unbuilt profile links', () => {
  assert.match(pages.speakers, /id="speakerDay"/);
  assert.match(pages.speakers, /id="speakerTrack"/);
  assert.match(pages.speakers, /id="speakerEmpty"/);
  assert.match(pages.speakers, /class="section band host-feature"/);
  assert.match(pages.speakers, /id="speakerTbaGrid"/);
  assert.match(pages.speakers, /href="\/assets\/speakers\.css"/);
  const script = read('assets/speakers-page.js');
  assert.deepEqual([...script.matchAll(/\{ name:'([^']+)', file:/g)].map(match => match[1]),
    ['Ike Aigbogun', 'Bulat Almukhametov', 'Sarah Power', 'Funmi Adegbola', 'Isaac Ochulor',
      'Jaina Ko', 'Claudia Soares', 'Subhrajeet Patra', 'Supriya Naidu', 'Zoe Borde']);
  assert.match(script, /const namedSpeakers = speakers\.filter\(speaker => speaker\.file\)/);
  assert.match(script, /const unannouncedSpeakers = speakers\.filter\(speaker => !speaker\.file\)/);
  assert.match(script, /grid\.innerHTML = namedSpeakers\.map\(renderCard\)/);
  assert.match(script, /tbaGrid\.innerHTML = unannouncedSpeakers\.map\(renderCard\)/);
  assert.match(script, /named speaker/);
  assert.match(script, /speaker\.sessions\.some\(session =>/);
  assert.match(script, /session\.day === Number\(day\.value\)/);
  assert.match(script, /session\.track === track\.value/);
  assert.doesNotMatch(script, /href=.*profile/);
  const css = read('assets/speakers.css');
  assert.match(css, /clip-path: none/);
  assert.match(css, /body\[data-page="speakers"\]/);
  assert.match(css, /grid-template-columns: 240px minmax\(0, 1fr\)/);
  assert.match(css, /width: 180px;\s*height: 225px/);
});
check('agenda has five days, three track selectors and five parallel rooms', () => {
  const script = read('assets/agenda-page.js');
  for (const name of ['Vision', 'Diagnose', 'Challenge', 'Evidence in Practice', 'Blueprint Day']) assert.ok(script.includes(`name:'${name}'`));
  assert.match(script, /dayNumber >= 2 && dayNumber <= 4/);
  assert.equal((script.match(/type:'Roadmap Lab'/g) || []).length, 3);
  assert.equal((script.match(/type:'Masterclass'/g) || []).length, 2);
  assert.match(script, /VIP only\. All five rooms run at the same time/);
  assert.doesNotMatch(script, /co-facilitator/);
});
check('partners preserve exact categories, logos, 2026 respondent source and official enquiry', () => {
  const html = pages.partners;
  for (const name of ['Media Partner', 'Sponsor Hall', 'On-stage Spotlight', 'Headline Partnership', 'FloCrunch', 'nuTheory', 'CTS Globe']) assert.ok(html.includes(name), name);
  assert.equal((html.match(/<div class="plate" role="listitem"><img src="\/assets\/sponsors\//g) || []).length, 15);
  assert.match(html, /haop-light\.webp/);
  assert.match(html, /Source: VIGIL Checkpoint 2026/);
  assert.match(html, /not confirmed 2027 Summit attendees/);
  assert.match(html, /mailto:ike@wearevigil\.global\?subject=Partnering%20with%20VIGIL/);
  assert.doesNotMatch(html, /<form|download sponsor deck/i);
});
check('about host anchor, approved experience logos and independence copy are present', () => {
  const html = pages.about;
  assert.match(html, /id="host"/);
  for (const logo of ['morrisons', 'cority', 'unilever']) assert.ok(html.includes(`/assets/experience/${logo}.webp`));
  assert.match(html, /Sponsors support VIGIL but never steer content, speakers or data/);
});
check('thank-you component remains detached from public pages and URL triggers', () => {
  const js = read('assets/registration-thank-you.js');
  for (const html of [read('index.html'), ...Object.values(pages)]) assert.doesNotMatch(html, /registration-thank-you\.js|tests\/fixtures\/thank-you/);
  assert.doesNotMatch(js, /location\.search|URLSearchParams|document\.referrer/);
  assert.match(js, /options\.verified !== true/);
  assert.match(js, /querySelector\('#vigilBadge'\)\.toDataURL\('image\/png'\)/);
});

console.log(`\n${count} new-page source checks passed.`);
