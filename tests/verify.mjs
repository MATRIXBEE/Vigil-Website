import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

// Dependency-free regression checks. These execute the existing source functions;
// browser interaction and visual results are recorded separately in VALIDATION.md.
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

check('application JavaScript compiles', () => new vm.Script(html.match(/<script>([\s\S]*?)<\/script>/)[1]));
check('Event metadata parses and all offers use official registration', () => {
  const event = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(event.startDate, '2027-03-01T14:00:00Z');
  assert.equal(event.endDate, '2027-03-05T17:00:00Z');
  event.offers.forEach(o => assert.equal(o.url, official));
});
check('all static and generated registration anchors use the exact official URL', () => {
  const tags = [...html.matchAll(/<a\b[^>]*data-register="[^"]*"[^>]*>/g)];
  assert.equal(tags.length, 14); // Twelve static links, two timeline alternatives.
  tags.forEach(([tag]) => assert.equal(tag.match(/href="([^"]+)"/)[1], official));
  assert.doesNotMatch(html, /<button\b[^>]*data-register/);
  assert.doesNotMatch(html, /wearevigil\.global\/register\?pass=/);
});
check('no public review controls or bracketed placeholders remain', () => {
  assert.doesNotMatch(html, /class="(?:flag|ph|preview-tag|review-toggle)"/);
  assert.doesNotMatch(html, /\[XX\]|\[Role, Organisation\]|\[Credentials|Illustrative preview|Prototype:/);
});
check('local static images, favicon and sharing artwork exist', () => {
  const paths = [...html.matchAll(/(?:src|href|content)="(assets\/[^"']+)"/g)].map(m => m[1]);
  paths.forEach(p => assert.ok(fs.existsSync(path.join(root, p)), p));
});
check('all nine generated colour portraits exist', () => {
  const names = slice('  var SPEAKERS = ', '  var rail =');
  [...names.matchAll(/'([^']+)'/g)].forEach(([, n]) => {
    assert.ok(fs.existsSync(path.join(root, 'assets/speakers', n.toLowerCase().replace(/\s+/g, '-') + '-portrait.webp')));
  });
});
check('exact supplied hero source is referenced', () => assert.match(html, /src="assets\/images\/vigil-hero-team\.png"/));
check('static IDs are unique', () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]).filter(id => !id.includes("'"));
  assert.equal(new Set(ids).size, ids.length);
});
check('marquee groups match and duplicate is hidden from accessibility tree', () => {
  const first = html.match(/<ul class="marquee-group">([\s\S]*?)<\/ul>/)[1];
  const second = html.match(/<ul class="marquee-group" aria-hidden="true">([\s\S]*?)<\/ul>/)[1];
  assert.equal(first.replace(/alt="[^"]*"/g, 'alt=""').trim(), second.trim());
  assert.match(html, /to\{transform:translateX\(-50%\)\}/);
});
check('reduced-motion static marquee and flap overrides exist', () => {
  assert.match(html, /@media \(prefers-reduced-motion:reduce\)/);
  assert.match(html, /\.marquee-track\{animation:none;width:auto\}/);
  assert.match(html, /\.flap\.go \.f1,\.flap\.go \.f2\{animation:none;visibility:hidden\}/);
});

const START = Date.UTC(2027, 2, 1, 14), DAY = 864e5, SESSION = 108e5;
const tz = vm.createContext({ Intl, Date, START, DAY, SESSION });
vm.runInContext(slice('  var TZNAME =', '  function renderTz()'), tz);
for (const [zone, expected] of [
  ['Europe/London', '2:00–5:00pm GMT'], ['America/New_York', '9:00am–12:00pm ET'],
  ['Asia/Dubai', '6:00–9:00pm Gulf (GST)'], ['Asia/Kolkata', '7:30–10:30pm IST'],
  ['Asia/Riyadh', '5:00–8:00pm KSA'], ['Asia/Qatar', '5:00–8:00pm Qatar'],
  ['Asia/Singapore', '10:00pm–1:00am (ends Tue) SGT'], ['Australia/Sydney', '1:00–4:00am AEDT'],
]) check(`timezone ${zone}`, () => assert.equal(tz.slot(0, zone).time, expected));
check('Sydney session starts on next local date', () => assert.equal(tz.slot(0, 'Australia/Sydney').date, 'Tue 2 March'));

let now = START - 1e3;
const count = vm.createContext({ START, DAY, SESSION, LAST_END: START + 4 * DAY + SESSION,
  Date: { now: () => now }, cd: { d: {}, h: {}, m: {}, s: {} }, live: {}, cdSr: {}, lastSr: '', countdownTimer: null,
  setUnit: (el, str) => { el.value = str; }, clearInterval() {} });
vm.runInContext(slice('  function pad(n)', '  /* One flap'), count);
vm.runInContext(slice('  function tick()', '  var countdownTimer ='), count);
check('countdown immediately before opening is 000:00:00:01', () => {
  count.tick(); assert.equal(Object.values(count.cd).map(e => e.value).join(':'), '000:00:00:01');
});
check('days remain three digits below 100', () => {
  now = START - 9 * DAY; count.tick(); assert.equal(count.cd.d.value, '009');
});
for (const [offset, message] of [[0, 'Live now: Day 1'], [SESSION, 'The Summit is under way: Day 1 done'], [DAY, 'Live now: Day 2'], [4 * DAY + SESSION, 'VIGIL Summit 2027 has ended. Recordings are for VIP pass holders.']]) {
  check(`countdown boundary ${offset}ms`, () => {
    now = START + offset; count.tick();
    assert.equal(Object.values(count.cd).map(e => e.value).join(':'), '000:00:00:00');
    assert.equal(count.live.textContent, message);
  });
}

let landing;
const flipContext = vm.createContext({ reduced: false, clearTimeout() {}, setTimeout(fn) { landing = fn; return 1; } });
vm.runInContext(slice('  function flip(f, nv)', '  /* Only digits'), flipContext);
const spans = Array.from({ length: 4 }, () => ({ textContent: '8' }));
const flap = { value: '8', querySelectorAll: () => spans, getAttribute() { return this.value; },
  setAttribute(k, v) { this.value = v; }, classList: { add() {}, remove() {} }, offsetWidth: 0 };
check('mechanical flip preserves old bottom while new top is displayed', () => {
  flipContext.flip(flap, '9'); assert.deepEqual(spans.map(s => s.textContent), ['9', '8', '8', '9']);
  landing(); assert.equal(spans[1].textContent, '9');
});
check('reduced-motion digit update has no staged flip', () => {
  flipContext.reduced = true; flipContext.flip(flap, '0'); assert.ok(spans.every(s => s.textContent === '0'));
});

let calendarBlob;
const calendar = vm.createContext({ Date, Blob, TextEncoder, encodeURIComponent, setTimeout() {}, showToast() {},
  URL: { createObjectURL(blob) { calendarBlob = blob; return 'blob:test'; }, revokeObjectURL() {} },
  document: { body: { appendChild() {} }, createElement: () => ({ click() {}, remove() {} }) } });
vm.runInContext(slice('  var TITLE =', "  $('#atcIcs').addEventListener").replace("  $('#atcGoogle').href = gUrl;", ''), calendar);
calendar.downloadIcs();
const ics = await calendarBlob.text(), lines = ics.split('\r\n');
check('ICS has CRLF termination and no physical line over 75 UTF-8 octets', () => {
  assert.ok(ics.endsWith('\r\n')); assert.ok(lines.every(line => Buffer.byteLength(line) <= 75));
});
check('ICS schedules all five daily 14:00–17:00 UTC sessions and a 30-minute alarm', () => {
  assert.match(ics, /DTSTART:20270301T140000Z/); assert.match(ics, /DTEND:20270301T170000Z/);
  assert.match(ics, /RRULE:FREQ=DAILY;COUNT=5/); assert.match(ics, /TRIGGER:-PT30M/);
});
check('ICS folding round-trips Unicode content', () => {
  const original = 'DESCRIPTION:' + 'Safety, evidence and AI — '.repeat(20);
  assert.equal(calendar.foldIcsLine(original).replace(/\r\n /g, ''), original);
});
check('Google Calendar contains the same UTC schedule and recurrence', () => {
  const url = new URL(calendar.gUrl);
  assert.equal(url.origin, 'https://calendar.google.com');
  assert.equal(url.searchParams.get('dates'), '20270301T140000Z/20270301T170000Z');
  assert.equal(url.searchParams.get('recur'), 'RRULE:FREQ=DAILY;COUNT=5');
});
console.log(`\n${checks} source and logic regression checks passed. No dependencies or build step required.`);
