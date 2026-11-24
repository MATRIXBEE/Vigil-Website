(function () {
  'use strict';
  const grid = document.querySelector('#speakerGrid');
  const tbaGrid = document.querySelector('#speakerTbaGrid');
  if (!grid || !tbaGrid) return;
  const speakers = [
    { name:'Ike Aigbogun', file:'ike-aigbogun', sessions:[{day:1,track:'',label:'Summit host · Days 1–5'},{day:2,track:'',label:'Summit host · Days 1–5'},{day:3,track:'',label:'Summit host · Days 1–5'},{day:4,track:'',label:'Summit host · Days 1–5'},{day:5,track:'',label:'Day 5 · Digital Skills Masterclass'}] },
    { name:'Bulat Almukhametov', file:'bulat-almukhametov', sessions:[{day:3,track:'data',label:'Day 3 · Challenge: Data & Evidence'},{day:5,track:'data',label:'Day 5 · Data & Evidence Roadmap Lab'}] },
    { name:'Sarah Power', file:'sarah-powers', sessions:[{day:2,track:'data',label:'Day 2 · Diagnose: Data & Evidence'}] },
    { name:'Funmi Adegbola', file:'funmi-adegbola', sessions:[{day:3,track:'',label:'Day 3 · Challenge Voices'}] },
    { name:'Isaac Ochulor', file:'isaac-ochulor', sessions:[{day:4,track:'ai',label:'Day 4 · Case study: AI & Automation'}] },
    { name:'Jaina Ko', file:'jaina-ko', sessions:[{day:3,track:'ai',label:'Day 3 · Challenge: AI & Automation'}] },
    { name:'Claudia Soares', file:'claudia-soares', sessions:[{day:3,track:'tools',label:'Day 3 · Challenge: Tools & Systems'},{day:5,track:'ai',label:'Day 5 · AI & Automation Roadmap Lab'}] },
    { name:'Subhrajeet Patra', file:'subhrajeet-patra', sessions:[{day:2,track:'ai',label:'Day 2 · Diagnose: AI & Automation'}] },
    { name:'Supriya Naidu', file:'supriya-naidu', sessions:[{day:5,track:'',label:'Day 5 · Human + AI Masterclass'}] },
    { name:'Zoe Borde', file:'zoe-borde', sessions:[{day:2,track:'tools',label:'Day 2 · Diagnose: Tools & Systems'},{day:5,track:'tools',label:'Day 5 · Tools & Systems Roadmap Lab'}] },
    { name:'Keynote speaker', sessions:[{day:1,track:'',label:'Day 1 · Keynote'}] },
    { name:'Speaker to be announced', sessions:[] },
    { name:'Speaker to be announced', sessions:[] },
    { name:'Speaker to be announced', sessions:[] }
  ];
  const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const namedSpeakers = speakers.filter(speaker => speaker.file);
  const unannouncedSpeakers = speakers.filter(speaker => !speaker.file);
  function renderCard(speaker) {
    const frame = speaker.file
      ? `<div class="vframe"><img src="/assets/speakers/${speaker.file}-portrait.webp" alt="Portrait of ${escape(speaker.name)}" loading="lazy" width="720" height="900"></div>`
      : '<div class="vframe tba"><img src="/assets/branding/vigil-mark.svg" alt="" width="68" height="73"></div>';
    const labels = [...new Set(speaker.sessions.map(item => item.label))];
    return `<article class="speaker-card">${frame}<h3>${escape(speaker.name)}</h3>${labels.length ? labels.map(label => `<p>${escape(label)}</p>`).join('') : '<p>To be announced</p>'}</article>`;
  }
  grid.innerHTML = namedSpeakers.map(renderCard).join('');
  tbaGrid.innerHTML = unannouncedSpeakers.map(renderCard).join('');
  const day = document.querySelector('#speakerDay');
  const track = document.querySelector('#speakerTrack');
  const empty = document.querySelector('#speakerEmpty');
  const count = document.querySelector('#speakerCount');
  function applyFilters() {
    let visible = 0;
    grid.querySelectorAll('.speaker-card').forEach((card, index) => {
      const speaker = namedSpeakers[index];
      const match = speaker.sessions.some(session =>
        (day.value === 'all' || session.day === Number(day.value)) &&
        (track.value === 'all' || session.track === track.value));
      card.hidden = !match;
      if (match) visible++;
    });
    empty.hidden = visible !== 0;
    count.textContent = `${visible} named speaker${visible === 1 ? '' : 's'} shown`;
  }
  day.addEventListener('change', applyFilters);
  track.addEventListener('change', applyFilters);
  document.querySelector('#speakerReset').addEventListener('click', () => { day.value = 'all'; track.value = 'all'; applyFilters(); day.focus(); });
  applyFilters();
})();
