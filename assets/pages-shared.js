(function () {
  'use strict';
  const burger = document.querySelector('#burger');
  const menu = document.querySelector('#mobileMenu');
  if (burger && menu) {
    function setOpen(open) {
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      menu.classList.toggle('open', open);
      if (!open) burger.focus();
    }
    burger.addEventListener('click', () => setOpen(burger.getAttribute('aria-expanded') !== 'true'));
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.classList.contains('open')) setOpen(false);
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 960 && menu.classList.contains('open')) setOpen(false);
    });
  }

  const title = 'VIGIL Summit 2027';
  const description = 'The global summit for evidence-led safety leaders. Live online, 1–5 March 2027, 2:00–5:00pm GMT. Days 1–4 free; Day 5, Blueprint Day, for VIP pass holders. Register once and join on Heartbeat: https://summit.wearevigil.global/p/register';
  const googleUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
    '&text=' + encodeURIComponent(title) +
    '&dates=20270301T140000Z/20270301T170000Z' +
    '&details=' + encodeURIComponent(description) +
    '&location=' + encodeURIComponent('Online (Zoom and Heartbeat)') +
    '&recur=' + encodeURIComponent('RRULE:FREQ=DAILY;COUNT=5');
  document.querySelectorAll('[data-calendar-google]').forEach(link => { link.href = googleUrl; });
  function foldLine(line) {
    const chunks = [], encoder = new TextEncoder();
    let chunk = '', size = 0;
    for (const char of Array.from(line)) {
      const bytes = encoder.encode(char).length;
      if (size + bytes > 75) { chunks.push(chunk); chunk = ' '; size = 1; }
      chunk += char; size += bytes;
    }
    chunks.push(chunk);
    return chunks.join('\r\n');
  }
  function escapeIcs(value) { return value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n'); }
  function downloadIcs() {
    const stamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//VIGIL//Summit 2027//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
      'BEGIN:VEVENT', 'UID:vigil-summit-2027@wearevigil.global', 'DTSTAMP:' + stamp,
      'DTSTART:20270301T140000Z', 'DTEND:20270301T170000Z', 'RRULE:FREQ=DAILY;COUNT=5',
      'SUMMARY:' + escapeIcs(title), 'DESCRIPTION:' + escapeIcs(description),
      'LOCATION:' + escapeIcs('Online (Zoom and Heartbeat)'), 'URL:https://summit.wearevigil.global/p/register',
      'BEGIN:VALARM', 'TRIGGER:-PT30M', 'ACTION:DISPLAY', 'DESCRIPTION:VIGIL Summit starts in 30 minutes',
      'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'];
    const url = URL.createObjectURL(new Blob([lines.map(foldLine).join('\r\n') + '\r\n'], { type: 'text/calendar;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url; anchor.download = 'VIGIL-Summit-2027.ics';
    document.body.append(anchor); anchor.click(); anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }
  window.VigilCalendar = Object.freeze({ googleUrl, downloadIcs });
  document.querySelectorAll('[data-calendar-ics]').forEach(button => button.addEventListener('click', downloadIcs));

  const timezone = document.querySelector('#timezone');
  const localTime = document.querySelector('#localTime');
  if (timezone && localTime) {
    function renderTime() {
      const zone = timezone.value === 'local' ? Intl.DateTimeFormat().resolvedOptions().timeZone : timezone.value;
      try {
        const start = new Intl.DateTimeFormat('en-GB', { timeZone: zone, weekday: 'long', day: 'numeric', month: 'long', hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date('2027-03-01T14:00:00Z'));
        const end = new Intl.DateTimeFormat('en-GB', { timeZone: zone, hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date('2027-03-01T17:00:00Z'));
        localTime.textContent = start + ' – ' + end + ' (' + zone + ')';
      } catch (_) { localTime.textContent = 'Local time unavailable; the Summit runs 14:00–17:00 GMT.'; }
    }
    timezone.addEventListener('change', renderTime);
    renderTime();
  }
})();
