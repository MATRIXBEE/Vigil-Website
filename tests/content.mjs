import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

// v4 content checks for the 17 Nov 2026 update brief and client decisions A–D.
// Dependency-free: run with `node tests/content.mjs` after `node tests/verify.mjs`.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const official = 'https://summit.wearevigil.global/p/register';
const destinations = {
  free: official,
  heartbeat: official,
  vip: 'https://summit.wearevigil.global/invitation?code=GC647E',
  vipplus: 'https://summit.wearevigil.global/invitation?code=683CEE',
  corporate: 'https://summit.wearevigil.global/invitation?code=C7GA72'
};
let checks = 0;
function check(name, fn) { fn(); checks++; console.log(`PASS ${name}`); }
function slice(from, to) {
  const a = html.indexOf(from), b = html.indexOf(to, a);
  assert.ok(a >= 0 && b > a, `Source boundaries: ${from}`);
  return html.slice(a, b);
}
const text = h => h.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<!--[\s\S]*?-->/g, ' ')
  .replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/’/g, "'").replace(/\s+/g, ' ');
const visible = text(html);
const norm = s => s.replace(/’/g, "'").replace(/\s+/g, ' ').trim();

/* ---------- Programme data, executed ---------- */
const prog = vm.createContext({});
vm.runInContext(slice('  var P = {', '  var stage =') + ';this.P=P;this.DAYS=DAYS;', prog);
const plain = x => JSON.parse(JSON.stringify(x));
const { DAYS, P } = plain({ DAYS: prog.DAYS, P: prog.P });

check('five days with the approved public names', () => {
  assert.deepEqual(DAYS.map(d => d.name), ['Vision', 'Diagnose', 'Challenge', 'Evidence in Practice', 'Blueprint Day']);
  assert.deepEqual(DAYS.map(d => d.vip), [false, false, false, false, true]);
});
check('each day has its own purpose, outcome and track text (no generic repetition)', () => {
  const focus = DAYS.map(d => d.focus), outcome = DAYS.map(d => d.outcome);
  assert.equal(new Set(focus).size, 5); assert.equal(new Set(outcome).size, 5);
  const trackText = DAYS.flatMap(d => d.tracks.map(t => t.t).filter(Boolean));
  assert.equal(new Set(trackText).size, trackText.length);
});
check('Days 2–4 tracks run Data → Tools → AI', () => {
  [1, 2, 3].forEach(i => assert.deepEqual(DAYS[i].tracks.map(t => t.k), ['data', 'tools', 'ai']));
});
check('Day 2 track descriptions match the brief', () => {
  assert.deepEqual(DAYS[1].tracks.map(t => t.t), [
    'Examine the evidence, data ownership, quality and how organisations use data to make decisions.',
    'Examine the difference between digitised processes and properly integrated, connected systems.',
    'Examine actual AI readiness, governance, awareness and the challenges surrounding automation.']);
  assert.match(DAYS[1].note, /not final industry benchmarks/);
});
check('Day 3 uses Challenge Voices and the approved description', () => {
  assert.ok(DAYS[2].focus.startsWith('Question and test assumptions, add perspective and deepen the conversation.'));
  assert.ok(DAYS[2].formats.includes('Challenge Voices'));
  assert.doesNotMatch(html, /Challenge panel|hardest problems in digital safety/i);
});
check('Day 4 uses the confirmed case-study description', () => {
  assert.ok(DAYS[3].focus.startsWith('Real implementation stories exploring what went wrong, what organisations did about it and what remains difficult.'));
});
const times = d => d.sessions.map(s => s[0]);
check('Days 1–4 session times follow Detailed Plan V3', () => {
  assert.deepEqual(times(DAYS[0]), ['14:00', '14:15', '14:35', '14:50', '15:10', '15:25', '15:55', '16:20', '16:35', '16:50']);
  [1, 2, 3].forEach(i => assert.deepEqual(times(DAYS[i]), ['14:00', '14:20', '14:35', '15:05', '15:20', '15:50', '16:20', '16:50']));
});
check('Days 1–4 named speakers sit in the correct slots', () => {
  const at = (d, t) => DAYS[d].sessions.find(s => s[0] === t)[2];
  assert.equal(at(0, '15:25'), 'Cori Carroll'); assert.equal(at(0, '15:55'), 'Ayomide Ojo');
  assert.equal(at(1, '14:35'), 'Sarah Power'); assert.equal(at(1, '15:20'), 'Zoe Borde'); assert.equal(at(1, '15:50'), 'Subhrajeet Patra');
  assert.equal(at(2, '14:35'), 'Bulat Almukhametov'); assert.equal(at(2, '15:20'), 'Claudia Soares'); assert.equal(at(2, '15:50'), 'Jaina Ko');
  assert.match(at(2, '16:20'), /^Funmi Adegbola/); assert.equal(at(3, '15:50'), 'Isaac Ochulor');
});
check('unconfirmed speakers are placeholders, not names', () => {
  assert.equal(DAYS[0].sessions[2][2].tba, 'To be announced');
  assert.equal(DAYS[3].sessions[2][2].tba, 'To be announced');
  assert.equal(DAYS[3].sessions[4][2].tba, 'To be announced');
  assert.doesNotMatch(html, /Mogollon|Laura|Kraemer|Serhat|Ngozi|Karly|AI summit companion/);
  assert.match(DAYS[0].sessions[2][1], /\(working title\)$/);
});
check('Day 5 offers five parallel rooms: three Roadmap Labs and two Masterclasses', () => {
  const r = DAYS[4].rooms;
  assert.equal(r.length, 5);
  assert.deepEqual(r.map(x => x.type), ['Roadmap Lab', 'Roadmap Lab', 'Roadmap Lab', 'Masterclass', 'Masterclass']);
  assert.deepEqual(r.map(x => x.by), ['Bulat Almukhametov', 'Zoe Borde', 'Claudia Soares', 'Supriya Naidu', 'Ike Aigbogun']);
  r.forEach(x => { assert.ok(x.n && x.d && x.o); });
  assert.equal(r[0].o, 'A drafted Data roadmap piece built from your Evidence Log.');
  assert.equal(r[3].o, 'A redesigned workflow with clear human checkpoints.');
});
check('Day 5 has no detailed timeline and preserves the parallel-room explanation', () => {
  assert.equal(DAYS[4].sessions, undefined);
  assert.match(DAYS[4].note, /All five rooms run at the same time: choose one as your primary experience/);
  assert.match(DAYS[4].note, /day closes with an overview of the rooms you did not attend/);
  assert.equal(DAYS[4].rooms[1].byNote, undefined);
  assert.doesNotMatch(html, /co-facilitator to be announced/i);
});
check('panel renderer shows outcome, collapsed Days 1–4 schedule and Day 5 rooms', () => {
  const r = slice('  function select(i, user) {', '  /* ---------- Mini-Checkpoint');
  ['You leave with', '<details class="sched">', 'sched-list', '14:00–17:00 — Choose a Room', 'roomCard', 'programme · times in GMT'].forEach(k => assert.ok(r.includes(k), k));
  assert.doesNotMatch(r, /rooms-bar|Co-facilitator to be announced/i);
  assert.match(slice('  function roomCard(r)', '  function select'), /access-tag vip">VIP</);
});

check('agenda link uses verified Heartbeat registration and day times stay GMT', () => {
  assert.match(html, /data-register="heartbeat" href="https:\/\/summit\.wearevigil\.global\/p\/register">Join Heartbeat for the full schedule/);
  assert.match(slice('  function renderTz()', '  tzSel.addEventListener'), /slot\(\+el\.getAttribute\('data-slot'\), 'Europe\/London'\)/);
});

/* ---------- Event strip ---------- */
check('homepage shows three summit time zones; local calculator includes Australia', () => {
  const z = slice('<ul class="zones">', '</ul>');
  assert.match(z, /<span>GMT<\/span><b>2:00 PM – 5:00 PM<\/b>/);
  assert.match(z, /<span>US Eastern \(EST\)<\/span><b>9:00 AM – 12:00 PM<\/b>/);
  assert.match(z, /<span>Gulf \(GST\)<\/span><b>6:00 PM – 9:00 PM<\/b>/);
  assert.equal((z.match(/<li>/g) || []).length, 3);
  assert.doesNotMatch(slice('<select id="tzSelect">', '</select>'), /IST|Kolkata/);
  assert.match(slice('<select id="tzSelect">', '</select>'), /Australia\/Sydney/);
});
check('countdown units are DAYS, HOURS, MINS, SECS', () => {
  assert.deepEqual([...slice('<div class="count-board"', '</div>\n        <span').matchAll(/class="lbl">([^<]+)</g)].map(m => m[1]), ['Days', 'Hours', 'Mins', 'Secs']);
});
check('calendar actions are Google Calendar and Microsoft Outlook only', () => {
  const a = slice('<div class="atc">', '</div>');
  assert.match(a, /Google Calendar<\/a>/); assert.match(a, /Microsoft Outlook<\/button>/);
  assert.doesNotMatch(html, /Apple Calendar|Apple\/Outlook/);
});

/* ---------- Checkpoint ---------- */
check('mini-Checkpoint asks three questions and never produces an archetype', () => {
  const ctx = vm.createContext({});
  vm.runInContext(slice('  var Q = [', '  var step =') + ';this.Q=Q;this.FOCUS=FOCUS;', ctx);
  ctx.Q = plain(ctx.Q);
  assert.equal(ctx.Q.length, 3);
  ctx.Q[2].o.forEach(o => assert.ok(ctx.FOCUS[o], o));
  const script = slice('  /* ---------- Mini-Checkpoint', '  /* ---------- Speakers rail');
  assert.doesNotMatch(script, /Watcher|Starter|Builder|Navigator|Sentinel|score/);
  assert.doesNotMatch(html, /id="rMeter"|id="rIcon"|Your first read/);
  assert.match(slice('<div class="result" id="qResult"', '</div>\n      <p class="disclaimer">'), /Take the full Checkpoint/);
});
check('Checkpoint content uses three lenses without calling them dimensions', () => {
  ['Data & Evidence', 'Digital Tools & Systems', 'AI & Automation'].forEach(d => assert.ok(text(slice('<section class="check"', '</section>')).includes(d)));
  assert.doesNotMatch(html, /pillar radar|across five pillars|5<\/span><span class="what">pillars/);
  assert.match(visible, /3 lenses for digital HSE/);
  assert.doesNotMatch(visible, /Checkpoint dimensions|three dimensions/i);
});

/* ---------- Speakers ---------- */
check('homepage speaker rail keeps Ike first and the reserved keynote last', () => {
  const ctx = vm.createContext({});
  vm.runInContext(slice('  var SPEAKERS = ', '  var rail =') + ';this.S=JSON.parse(JSON.stringify(SPEAKERS));', ctx);
  ctx.S = plain(ctx.S);
  assert.deepEqual(ctx.S.map(s => s.n), ['Ike Aigbogun', 'Bulat Almukhametov', 'Sarah Power', 'Funmi Adegbola',
    'Isaac Ochulor', 'Jaina Ko', 'Claudia Soares', 'Subhrajeet Patra', 'Supriya Naidu', 'Zoe Borde',
    'Speaker to be announced', 'Speaker to be announced', 'Speaker to be announced', 'Keynote speaker']);
  assert.equal(ctx.S.at(-1).tba, true); assert.equal(ctx.S.at(-1).f, undefined);
  assert.deepEqual(ctx.S.at(-1).r, ['Day 1 · Keynote']);
  assert.equal(ctx.S.slice(-4, -1).filter(s => s.tba && !s.f && s.r.length === 0).length, 3);
});
check('no Speak at VIGIL links, cards or buttons', () => {
  assert.doesNotMatch(html, /href="\/speak"|>Speak at VIGIL<|Have evidence worth sharing/);
});
check('speaker cards and host photo have no duotone or colour-swap hover', () => {
  assert.doesNotMatch(html, /-duo\.webp/);
  assert.doesNotMatch(html, /\.host-v:hover|\.host-v \.col/);
});

/* ---------- Host ---------- */
check('host profile: new title, digital specialist, experience logos', () => {
  const h = text(slice('<section class="host rule"', '</section>'));
  assert.match(h, /UK-based/);
  assert.match(h, /HSE Digital Transformation & Workforce Capability Specialist/);
  assert.match(h, /Digital specialist Implementation, training and adoption specialist for global teams\./);
  const host = slice('<section class="host rule"', '</section>');
  for (const [name, file] of [['Morrisons', 'morrisons.webp'], ['Cority', 'cority.webp'], ['Unilever', 'unilever.webp']]) {
    assert.ok(host.includes(`src="assets/experience/${file}" alt="${name} logo"`));
    assert.ok(fs.existsSync(path.join(root, 'assets/experience', file)));
  }
  assert.doesNotMatch(html, /London-based|H&S professional|>Independent</);
});

/* ---------- Chart ---------- */
check('role chart runs senior → practitioner → Other and totals 100%', () => {
  const rows = [...slice('<ol class="bars" id="bars">', '</ol>').matchAll(/class="lab">([^<]+)<[\s\S]*?class="val">([\d.]+)%/g)];
  assert.deepEqual(rows.map(r => r[1]), ['C-suite / Executive', 'Leader / Manager', 'Advisor / Officer', 'HSE Consultant', 'Operations / Site', 'Other']);
  assert.equal(Math.round(rows.reduce((a, r) => a + +r[2], 0) * 10) / 10, 100);
  assert.match(visible, /not confirmed 2027 Summit attendees/);
});

/* ---------- Passes ---------- */
check('chart highlights C-suite and Leader, not Advisor', () => {
  const rows = [...slice('<ol class="bars" id="bars">', '</ol>').matchAll(/<li class="bar( key)?"><span class="lab">([^<]+)<[\s\S]*?class="val">([\d.]+)%/g)];
  assert.deepEqual(rows.filter(r => r[1]).map(r => r[2]), ['C-suite / Executive', 'Leader / Manager']);
  assert.deepEqual(rows.map(r => r[3]), ['17.5', '23.8', '41.3', '6.3', '3.2', '7.9']);
});

check('pass prices and benefits match the approved decisions', () => {
  const t = text(slice('<div class="passes', '<div class="pass-foot">'));
  ['$0', '$197', '$997', 'from $3,997', 'Up to 5 people', 'Access to Days 1–4 live sessions', '48-hour access to session recordings',
    'Full access to Day 5, Blueprint Day', 'The three Roadmap Labs and two Masterclasses', 'Live Zoom rooms', 'CPD certificate',
    'Summit platform access', 'Post-summit four-week Digital Sprint implementation clinics', 'Corporate team access']
    .forEach(k => assert.ok(t.includes(k), k));
  assert.doesNotMatch(t, /ongoing support|ongoing implementation support/i);
  assert.doesNotMatch(t, /support to deliver your plan/i);
  assert.doesNotMatch(html, /Day 5: Roadmap|Day 5, Roadmap|Recordings are for VIP/);
});
check('Corporate pass has JOIN NOW and Request an Invoice without a form', () => {
  const card = slice('<div class="ptop"><h3 class="pname">Corporate</h3>', '</article>');
  assert.match(card, /data-register="corporate" href="https:\/\/summit\.wearevigil\.global\/invitation\?code=C7GA72">JOIN NOW<\/a>/);
  assert.match(card, /href="mailto:ike@wearevigil\.global\?subject=Corporate%20Pass%20Invoice%20Request%20%E2%80%93%20VIGIL%20Summit%202027">Request an Invoice<\/a>/);
  assert.doesNotMatch(card, /<form|invoice is automatically/i);
});

/* ---------- Corporate attendees and sponsors ---------- */
check('In Good Company holds no unconfirmed attendee logos or carousel', () => {
  const company = slice('<div class="partners-row reveal">', '</section>');
  assert.match(company, /<h2 id="companyTitle">In Good Company<\/h2>/);
  assert.match(company, /Corporate attendee logos will appear here once confirmed/);
  assert.doesNotMatch(company, /<img|marquee|Unilever|Cority|Morrisons|sponsors\//i);
  assert.doesNotMatch(html, /class="marquee|marquee-track|marquee-group/);
});
check('partners: HeyLina replaces Ensured Safety; NEBOSH excluded; no public prices', () => {
  assert.match(html, /src="assets\/sponsors\/heylina\.webp" alt="HeyLina logo"/);
  assert.doesNotMatch(html, /src="assets\/sponsors\/ensured-safety\.webp"|NEBOSH/i);
  assert.ok(fs.existsSync(path.join(root, 'assets/sponsors/heylina.webp')));
  const pt = slice('<section class="rule" id="partners"', '</section>');
  assert.doesNotMatch(pt, /\$|class="tiers"|In-kind/);
  assert.match(pt, /href="mailto:ike@wearevigil\.global\?subject=Partnering%20with%20VIGIL">Partner with VIGIL/);
});

check('Category Sponsors and Summit Partners have their exact distinct logo sets', () => {
  const category = slice('<div class="category-logos">', '<div class="reveal d1">');
  const summit = slice('<div class="pt-logos">', '</section>');
  const refs = source => [...source.matchAll(/src="assets\/sponsors\/([^\"]+\.webp)" alt="([^\"]+)"/g)];
  const categoryFiles = ['flocrunch', 'nutheory', 'cts'];
  const summitFiles = ['ai-in-hse', 'heylina', 'evex-safety', 'flowforms', 'haop-light', 'hsz-solutions', 'korviaone', 'own-the-prompt', 'qhse-directory', 'shedai', 'hse-nations', 'sowshe-a'];
  assert.match(html, /<h3 id="categoryTitle">Category Sponsors<\/h3>/);
  assert.match(html, /<h3 id="summitPartnersTitle">Summit Partners<\/h3>/);
  assert.doesNotMatch(summit, /class="plate dark"/);
  assert.doesNotMatch(summit, /src="assets\/sponsors\/haop\.webp"/);
  assert.ok(fs.existsSync(path.join(root, 'assets/sponsors/haop.webp')));
  assert.deepEqual(refs(category).map(x => x[1]), categoryFiles.map(x => `${x}.webp`));
  assert.deepEqual(refs(summit).map(x => x[1]), summitFiles.map(x => `${x}.webp`));
  for (const [, file, alt] of [...refs(category), ...refs(summit)]) {
    assert.ok(alt.endsWith(' logo'));
    assert.ok(fs.statSync(path.join(root, 'assets/sponsors', file)).size > 0);
  }
  assert.equal(new Set([...refs(category), ...refs(summit)].map(x => x[1])).size, 15);
  assert.match(html, /\.pt-logos\{display:grid;grid-template-columns:repeat\(6,minmax\(0,1fr\)\)/);
});
check('Category Sponsors replaced the old Headline Sponsor placeholder', () => {
  const pt = slice('<section class="rule" id="partners"', '</section>');
  assert.match(pt, /<div class="category-sponsors reveal d1"/);
  assert.doesNotMatch(pt, /Headline Sponsor|Current partners/i);
  assert.doesNotMatch(pt, /assets\/experience\//);
});

/* ---------- FAQ ---------- */
const faq = norm(text(slice('<div class="faq reveal d1">', '</section>')));
const approved = [
  'Yes. VIGIL 2027 is an online summit streamed via Zoom and Heartbeat.',
  "Heartbeat is your home for VIGIL 2027. While VIGIL will be streamed across our online channels, registered attendees should join us on Heartbeat for the full summit experience. It's where you'll find the daily programme, session links, speaker and partner information, VIGIL workbooks and resources, session recordings, and important updates throughout the week. Register once. Join Heartbeat. Everything you need for VIGIL will be waiting for you there.",
  'VIP includes everything in the Free pass, plus access to the full Blueprint Day experience, including the Roadmap Labs and Masterclasses. VIP attendees also receive a CPD certificate and access to the live Zoom rooms, along with the additional summit resources and recording access included in their ticket.',
  'Absolutely. VIGIL is designed to be valuable across teams, with different sessions offering perspectives for leaders, managers and practitioners. Each registered team member gets their own access to the VIGIL Heartbeat space, including the programme, workbooks and resources, speaker and partner information, event updates, and session recordings included with their ticket. Bringing a team also means you can divide and explore different sessions and tracks, then bring the learning back together within your organisation.',
  'The VIGIL Checkpoint is our industry diagnostic exploring how HSE professionals and organisations are progressing across Data & Evidence, Digital Tools & Systems, and AI & Automation. It helps us understand what is happening in practice, where progress is being made, where challenges remain and what organisations and professionals are experiencing. The findings inform the State of Digital HSE Report and help ground VIGIL conversations in evidence rather than assumptions. Take the free 10-minute, 30-question digital HSE maturity assessment, and you will get an archetype, a report sent to your inbox and some recommended next steps.',
  'Our speakers may come from HSE, technology, data, AI, digital transformation, academia and other fields that can contribute meaningfully to the conversations we are exploring. Speaker opportunities are curated around the VIGIL programme, so we look for people whose experience and perspective align with the themes and outcomes of each session. Vendors who want to showcase a product should look at partnership instead.',
  "We work with organisations that share VIGIL's interest in advancing how HSE uses data, technology and digital capability. Partnership can take different forms: from strategic and industry partnerships to supporting the event through sponsorship, expertise, resources or audience reach. If your organisation would like to explore working with VIGIL, please get in touch with our team. We'll discuss your objectives and where there may be a meaningful fit."
];
approved.forEach((a, i) => check(`FAQ approved answer Q${i + 1 === 1 ? 1 : i + 1} is present word for word`, () => assert.ok(faq.includes(norm(a)), a.slice(0, 50))));
check('FAQ links: Heartbeat → registration, Checkpoint → existing destination', () => {
  const f = slice('<div class="faq reveal d1">', '</section>');
  assert.match(f, new RegExp(`<a data-register="heartbeat" href="${official.replace(/[./]/g, '\\$&')}">Join Heartbeat\\.</a>`));
  assert.match(f, /href="https:\/\/checkpoint\.wearevigil\.global\/\?utm_source=site&amp;utm_medium=faq/);
  assert.equal((f.match(/<details/g) || []).length, 9);
});

/* ---------- Site-wide ---------- */
check('free registration stays unchanged and paid links use distinct invitations', () => {
  assert.doesNotMatch(html, /href="https?:\/\/(www\.)?wearevigil\.global\/register/);
  [...html.matchAll(/<a\b[^>]*data-register="([^"]+)"[^>]*>/g)].forEach(([tag, kind]) => {
    assert.ok(Object.hasOwn(destinations, kind), kind);
    assert.equal(tag.match(/href="([^"]+)"/)[1], destinations[kind]);
  });
});
check('fixed schedule copy is GMT only', () => {
  assert.doesNotMatch(visible, /9:00am–12:00pm|6:00–9:00pm|Times shown in GMT first/);
  assert.doesNotMatch(visible, /\bIST\b/);
});
check('no review notes, bracketed placeholders or TODO markers in visible copy', () => {
  assert.doesNotMatch(visible, /\[[A-Z][^\]]*\]|TODO|TBC|lorem/i);
});
check('all local asset references resolve', () => {
  const refs = [...html.matchAll(/(?:src|href|content)=["'](assets\/[^"']+)["']/g)].map(m => m[1]);
  refs.forEach(r => assert.ok(fs.existsSync(path.join(root, r)), r));
  assert.ok(fs.existsSync(path.join(root, 'assets/speakers/ike-aigbogun-portrait.webp')));
});
check('day panel script compiles with the new renderer', () => new vm.Script(html.match(/<script>([\s\S]*?)<\/script>/)[1]));

console.log(`\n${checks} v4 content checks passed.`);
