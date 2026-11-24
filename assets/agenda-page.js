(function () {
  'use strict';
  const tabs = document.querySelector('#agendaTabs');
  const panel = document.querySelector('#agendaPanel');
  if (!tabs || !panel) return;
  const days = [
    { name:'Vision', focus:'Establish what digital HSE is, what it is not, and where organisations are starting from. The day introduces the Checkpoint, emerging digital HSE challenges and the confidence to challenge, question, decide and act.', outcome:'A clear understanding of digital HSE, your own starting point and the confidence to challenge existing processes, vendors and assumptions.', formats:['Host-led sessions','Keynote','Guest speaker','Director-level interview'], tracks:[{key:'vision',name:'Vision',description:'Where are we going, and who is leading it?'}] },
    { name:'Diagnose', focus:'Understand what the interim VIGIL Checkpoint data reveals about the state of digital HSE, one track at a time.', outcome:'Understand the three biggest gaps identified in the interim Checkpoint data, and decide which are relevant to your own organisation.', note:'Checkpoint findings shared during the Summit are interim results from the current respondent sample, not final industry benchmarks.', formats:['Interim Checkpoint data reveal','One Diagnose session per track','Cross-Lens Diagnosis'], tracks:[{key:'data',name:'Data & Evidence',description:'Examine the evidence, data ownership, quality and how organisations use data to make decisions.'},{key:'tools',name:'Digital Tools & Systems',description:'Examine the difference between digitised processes and properly integrated, connected systems.'},{key:'ai',name:'AI & Automation',description:'Examine actual AI readiness, governance, awareness and the challenges surrounding automation.'}] },
    { name:'Challenge', focus:'Question and test assumptions, add perspective and deepen the conversation. Day 3 builds on Day 2, but speakers are not required to agree with its diagnosis.', outcome:'New perspectives, evidence-backed challenges to accepted views and a clearer understanding of whether the Day 2 diagnosis still holds.', note:'Each track speaker brings their own topic, grounded in Checkpoint evidence. Session titles will be announced.', formats:['One Challenge session per track','Challenge Voices'], tracks:[{key:'data',name:'Data & Evidence',description:'A new perspective on Data & Evidence, backed by evidence.'},{key:'tools',name:'Digital Tools & Systems',description:'A new perspective on Tools & Systems, backed by evidence.'},{key:'ai',name:'AI & Automation',description:'A new perspective on AI & Automation, backed by evidence.'}] },
    { name:'Evidence in Practice', focus:'Real implementation stories exploring what went wrong, what organisations did about it and what remains difficult. The focus is on friction, mistakes, adaptation and lessons learned, not polished success stories.', outcome:'Recognise implementation risks and warning signs, learn from real experiences and prepare to address these challenges.', formats:['One case study per track','Cross-Lens Evidence'], tracks:[{key:'data',name:'Data & Evidence',description:'Real lessons from a Data & Evidence implementation, including the messy parts.'},{key:'tools',name:'Digital Tools & Systems',description:'Real lessons from a tools rollout, including the messy parts.'},{key:'ai',name:'AI & Automation',description:'Real lessons from an AI or automation pilot, including the messy parts.'}] },
    { name:'Blueprint Day', vip:true, focus:'Turn the week’s evidence into a practical next step for your organisation. Choose one of five parallel rooms: three Roadmap Labs and two Masterclasses.', outcome:'A drafted roadmap piece or a redesigned process, plus a commitment with an owner, a first milestone and a date.', note:'VIP only. All five rooms run at the same time: choose one as your primary experience. The day closes with an overview of the rooms you did not attend.', rooms:[
      {key:'data',type:'Roadmap Lab',name:'Data & Evidence Roadmap Lab',by:'Bulat Almukhametov',description:'Short expert input, then facilitated working time, peer challenge and a cross-lens dependency check.',outcome:'A drafted Data roadmap piece built from your Evidence Log.'},
      {key:'tools',type:'Roadmap Lab',name:'Tools & Systems Roadmap Lab',by:'Zoe Borde',description:'Short expert input, then facilitated working time, peer challenge and a cross-lens dependency check.',outcome:'A drafted Tools roadmap piece.'},
      {key:'ai',type:'Roadmap Lab',name:'AI & Automation Roadmap Lab',by:'Claudia Soares',description:'Short expert input, then facilitated working time, peer challenge and a cross-lens dependency check.',outcome:'A drafted AI roadmap piece.'},
      {key:'roadmap',type:'Masterclass',name:'Human + AI: Designing Better HSE Work',by:'Supriya Naidu',description:'Bring one real HSE workflow and decide which steps should remain human-controlled, be automated, be AI-assisted or be left alone.',outcome:'A redesigned workflow with clear human checkpoints.'},
      {key:'roadmap',type:'Masterclass',name:'Digital Skills: Design, Build, Automate, Analyse',by:'Ike Aigbogun',description:'Practical digital skills with a Microsoft 365 focus: Microsoft Forms, Power Automate, data design, the Process-to-System Canvas and workflow design, with a practical flow demonstration showing where AI can help.',outcome:'One process redesigned into a simple digital system, and a method to repeat the approach.'}
    ] }
  ];
  const colors = {vision:'var(--p-vision)',data:'var(--p-data)',tools:'var(--p-tools)',ai:'var(--p-ai)',roadmap:'var(--p-roadmap)'};
  const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  tabs.innerHTML = days.map((day, index) => `<button type="button" class="day-tab" role="tab" id="dayTab${index + 1}" aria-controls="agendaPanel" aria-selected="${index === 0}" tabindex="${index === 0 ? 0 : -1}" data-day="${index + 1}"><span>Day ${index + 1} · ${index === 4 ? 'VIP' : 'Free'}</span><strong>${escape(day.name)}</strong></button>`).join('');
  let active = 1;
  function render(dayNumber, focusTab) {
    active = dayNumber;
    const day = days[dayNumber - 1];
    tabs.querySelectorAll('[role="tab"]').forEach((tab, index) => {
      const selected = index + 1 === dayNumber;
      tab.setAttribute('aria-selected', String(selected)); tab.tabIndex = selected ? 0 : -1;
      if (selected && focusTab) tab.focus();
    });
    panel.setAttribute('aria-labelledby', 'dayTab' + dayNumber);
    const trackFilter = dayNumber >= 2 && dayNumber <= 4
      ? '<div class="filter-row"><label for="agendaTrack">Track</label><select id="agendaTrack"><option value="all">All tracks</option><option value="data">Data &amp; Evidence</option><option value="tools">Digital Tools &amp; Systems</option><option value="ai">AI &amp; Automation</option></select><button type="button" id="agendaReset">Reset filter</button></div>' : '';
    const tracks = day.tracks ? `<div class="track-grid" id="agendaTracks">${day.tracks.map(track => `<article class="card track-card" data-track="${track.key}" style="--accent:${colors[track.key]}"><h3>${escape(track.name)}</h3><p>${escape(track.description)}</p></article>`).join('')}</div>` : '';
    const rooms = day.rooms ? `<h3 style="margin:32px 0 18px">14:00–17:00 — Choose a Room <span class="teal">(GMT)</span></h3><div class="rooms">${day.rooms.map(room => `<article class="card room" style="--accent:${colors[room.key]}"><span class="label">${escape(room.type)}</span><h3>${escape(room.name)}</h3><p>With ${escape(room.by)}</p><p>${escape(room.description)}</p><p class="fine">You leave with: ${escape(room.outcome)}</p></article>`).join('')}</div>` : '';
    const overview = day.formats ? `<details class="disclosure"><summary>Public programme overview</summary><div class="body"><p>Formats include:</p><ul>${day.formats.map(format => `<li>${escape(format)}</li>`).join('')}</ul><p style="margin-top:14px">Join Heartbeat for the full schedule and updates.</p></div></details>` : '';
    panel.innerHTML = `<div class="panel day-detail"><span class="label"><span class="tri"></span>Day ${dayNumber} · ${dayNumber} March 2027 · 14:00–17:00 GMT</span><h2 style="margin-top:14px">${escape(day.name)}</h2><p class="lead">${escape(day.focus)}</p><div class="day-meta"><span class="tag ${day.vip ? 'vip' : ''}">${day.vip ? 'VIP only' : 'Days 1–4 free'}</span><span class="tag">Live online</span></div><p class="note"><strong>You leave with:</strong> ${escape(day.outcome)}</p>${day.note ? `<p class="fine" style="margin-top:18px">${escape(day.note)}</p>` : ''}${trackFilter}${tracks}${rooms}${overview}<div class="actions"><a class="btn ${day.vip ? 'btn-primary' : 'btn-ghost'}" href="${day.vip ? 'https://summit.wearevigil.global/invitation?code=GC647E' : 'https://summit.wearevigil.global/p/register'}">${day.vip ? 'Get your VIP pass' : 'Register free'}</a><a class="link" href="https://summit.wearevigil.global/p/register">Join Heartbeat for the full schedule</a></div></div>`;
    const filter = panel.querySelector('#agendaTrack');
    if (filter) {
      filter.addEventListener('change', () => panel.querySelectorAll('.track-card').forEach(card => { card.hidden = filter.value !== 'all' && card.dataset.track !== filter.value; }));
      panel.querySelector('#agendaReset').addEventListener('click', () => { filter.value = 'all'; filter.dispatchEvent(new Event('change')); filter.focus(); });
    }
  }
  function fromHash() { const found = /^#day-([1-5])$/.exec(location.hash); render(found ? Number(found[1]) : 1, false); }
  tabs.addEventListener('click', event => { const tab = event.target.closest('[data-day]'); if (!tab) return; const day = Number(tab.dataset.day); history.pushState(null, '', '#day-' + day); render(day, false); });
  tabs.addEventListener('keydown', event => {
    if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 1 : event.key === 'End' ? 5 : ((active - 1 + (event.key === 'ArrowRight' ? 1 : -1) + 5) % 5) + 1;
    history.pushState(null, '', '#day-' + next); render(next, true);
  });
  window.addEventListener('popstate', fromHash);
  window.addEventListener('hashchange', fromHash);
  fromHash();
})();
