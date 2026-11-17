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
  assert.doesNotMatch(html, /Mogollon|Laura|Kraemer|Serhat|Ngozi|Karly|Category Sponsor|Headline Sponsor|AI summit companion/);
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
check('Day 5 schedule keeps every Detailed Plan slot, with parallel groups', () => {
  assert.deepEqual(times(DAYS[4]), ['14:00', '14:15', '14:35–16:30', '16:30', '16:55']);
  assert.equal(DAYS[4].sessions[1][3].length, 5); assert.equal(DAYS[4].sessions[2][3].length, 5);
});
check('panel renderer shows outcome, schedule and room cards', () => {
  const r = slice('  function select(i, user) {', '  /* ---------- Mini-Checkpoint');
  ['You leave with', 'sched-list', 'rooms-bar', 'roomCard', 'programme · times in GMT'].forEach(k => assert.ok(r.includes(k), k));
  assert.match(slice('  function roomCard(r)', '  function select'), /access-tag vip">VIP</);
});

/* ---------- Event strip ---------- */
check('time-zone cards: GMT, US Eastern (EST), Gulf (GST); no IST option', () => {
  const z = slice('<ul class="zones">', '</ul>');
  assert.match(z, /<span>GMT<\/span><b>2:00 PM – 5:00 PM<\/b>/);
  assert.match(z, /<span>US Eastern \(EST\)<\/span><b>9:00 AM – 12:00 PM<\/b>/);
  assert.match(z, /<span>Gulf \(GST\)<\/span><b>6:00 PM – 9:00 PM<\/b>/);
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
check('Checkpoint content uses the three dimensions', () => {
  ['Data & Evidence', 'Digital Tools & Systems', 'AI & Automation'].forEach(d => assert.ok(text(slice('<section class="check"', '</section>')).includes(d)));
  assert.doesNotMatch(html, /pillar radar|across five pillars|5<\/span><span class="what">pillars/);
  assert.match(visible, /3 Checkpoint dimensions/);
});

/* ---------- Speakers ---------- */
check('speaker order: Ike, keynote placeholder, Sarah and Claudia swapped', () => {
  const ctx = vm.createContext({});
  vm.runInContext(slice('  var SPEAKERS = ', '  var rail =') + ';this.S=JSON.parse(JSON.stringify(SPEAKERS));', ctx);
  ctx.S = plain(ctx.S);
  assert.deepEqual(ctx.S.map(s => s.n), ['Ike Aigbogun', 'Keynote speaker', 'Bulat Almukhametov', 'Sarah Power', 'Funmi Adegbola',
    'Isaac Ochulor', 'Jaina Ko', 'Claudia Soares', 'Subhrajeet Patra', 'Supriya Naidu', 'Zoe Borde']);
  assert.equal(ctx.S[1].tba, true); assert.equal(ctx.S[1].f, undefined);
});
check('no Speak at VIGIL links, cards or buttons', () => {
  assert.doesNotMatch(html, /href="\/speak"|>Speak at VIGIL<|Have evidence worth sharing/);
});
check('speaker cards and host photo have no duotone or colour-swap hover', () => {
  assert.doesNotMatch(html, /-duo\.webp/);
  assert.doesNotMatch(html, /\.host-v:hover|\.host-v \.col/);
});

/* ---------- Host ---------- */
check('host profile: new title, digital specialist, experience names', () => {
  const h = text(slice('<section class="host rule"', '</section>'));
  assert.match(h, /HSE Digital Transformation & Workforce Capability Specialist/);
  assert.match(h, /Digital specialist Implementation, training and adoption specialist for global teams\./);
  assert.match(h, /Experience built across Morrisons Cority Unilever/);
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
check('pass prices and benefits match the approved decisions', () => {
  const t = text(slice('<div class="passes', '<div class="pass-foot">'));
  ['$0', '$197', '$997', 'from $3,997', 'Up to 5 people', 'Access to Days 1–4 live sessions', '48-hour access to session recordings',
    'Full access to Day 5, Blueprint Day', 'The three Roadmap Labs and two Masterclasses', 'Live Zoom rooms', 'CPD certificate',
    'Summit platform access', 'Post-summit 4-week implementation clinics', 'Ongoing implementation support', 'Corporate team access']
    .forEach(k => assert.ok(t.includes(k), k));
  assert.doesNotMatch(html, /Day 5: Roadmap|Day 5, Roadmap|Recordings are for VIP/);
});

/* ---------- Partners ---------- */
check('partners: HeyLina removed, no public sponsorship prices, enquiry uses verified email', () => {
  assert.doesNotMatch(html, /heylina|HeyLina|Heyline/i);
  assert.ok(!fs.existsSync(path.join(root, 'assets/sponsors/heylina.webp')));
  const pt = slice('<section class="rule" id="partners"', '</section>');
  assert.doesNotMatch(pt, /\$|class="tiers"|In-kind/);
  assert.match(pt, /href="mailto:ike@wearevigil\.global\?subject=Partnering%20with%20VIGIL">Partner with VIGIL/);
  ['flocrunch', 'qhse-directory', 'cts', 'hse-nations', 'shedai'].forEach(l => assert.match(pt, new RegExp(`sponsors/${l}\\.webp`)));
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
check('no old registration URLs; every link with data-register uses the official URL', () => {
  assert.doesNotMatch(html, /href="https?:\/\/(www\.)?wearevigil\.global\/register/);
  [...html.matchAll(/<a\b[^>]*data-register="[^"]*"[^>]*>/g)].forEach(([t]) => assert.equal(t.match(/href="([^"]+)"/)[1], official));
});
check('fixed time lines use EST, not ET; IST only in automatic local-time mapping', () => {
  assert.doesNotMatch(visible, /\bET\b/);
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
