/* Inactive until a verified registration provider success event calls VigilThankYou.open().
   A URL parameter, referrer or CTA click must never call open(). */
(function () {
  'use strict';
  let dialog;
  let lastFocus;
  let passType;
  function drawBadge() {
    const canvas = dialog.querySelector('#vigilBadge');
    const ctx = canvas.getContext('2d');
    const name = dialog.querySelector('#vigilBadgeName').value.trim().slice(0, 26) || 'Your name';
    ctx.fillStyle = '#02090F'; ctx.fillRect(0, 0, 600, 600);
    ctx.fillStyle = '#00B89E'; ctx.beginPath(); ctx.moveTo(40, 42); ctx.lineTo(90, 42); ctx.lineTo(65, 88); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#FFFFFF'; ctx.font = '700 42px Poppins, sans-serif'; ctx.fillText('VIGIL', 105, 82);
    ctx.font = '700 50px Poppins, sans-serif'; ctx.fillText("I'm attending", 44, 290);
    ctx.fillStyle = '#93A7B1'; ctx.font = '300 28px Poppins, sans-serif'; ctx.fillText('VIGIL Summit 2027', 44, 342);
    ctx.fillText('1–5 March · Live online', 44, 383);
    ctx.fillStyle = '#FFFFFF'; ctx.font = '500 34px Poppins, sans-serif'; ctx.fillText(name, 44, 505);
  }
  function mount() {
    if (dialog) return dialog;
    dialog = document.createElement('dialog');
    dialog.className = 'vigil-thanks'; dialog.id = 'vigilThankYou';
    dialog.setAttribute('aria-labelledby', 'vigilThanksTitle');
    dialog.innerHTML = '<div class="vigil-thanks-inner"><div class="vigil-thanks-head"><div><p class="label"><span class="tri"></span>VIGIL Summit 2027</p><h2 id="vigilThanksTitle">You’re registered.</h2><p>See you on 1 March. Check your registration confirmation for joining details.</p></div><button class="vigil-thanks-close" type="button" aria-label="Close registration confirmation">×</button></div><div class="vigil-thanks-section"><h3>Add it to your calendar</h3><p>1–5 March 2027 · 14:00–17:00 GMT</p><div class="vigil-thanks-actions"><a class="btn btn-ghost btn-sm" id="vigilThanksGoogle" target="_blank" rel="noopener">Google Calendar</a><button class="btn btn-ghost btn-sm" id="vigilThanksIcs" type="button">Microsoft Outlook (.ics)</button></div></div><div class="vigil-thanks-section"><h3>Tell your network</h3><p>Make an “I’m attending” badge in your browser. Your name stays on this device.</p><div class="vigil-thanks-badge"><canvas id="vigilBadge" width="600" height="600" role="img" aria-label="VIGIL Summit attendance badge preview"></canvas><div><label for="vigilBadgeName">Name on badge</label><input id="vigilBadgeName" autocomplete="name" maxlength="26"><button class="btn btn-primary btn-sm" id="vigilBadgeDownload" type="button">Download badge PNG</button></div></div></div><div class="vigil-thanks-section" id="vigilThanksUpgrade" hidden><h3>Want Blueprint Day?</h3><p>VIP adds Day 5, recordings and a CPD certificate.</p><div class="vigil-thanks-actions"><a class="link" href="https://summit.wearevigil.global/invitation?code=GC647E">Get your VIP pass</a></div></div></div>';
    document.body.append(dialog);
    dialog.querySelector('.vigil-thanks-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => {
      dialog.querySelector('#vigilBadgeName').value = '';
      drawBadge();
      if (lastFocus?.isConnected) lastFocus.focus();
    });
    dialog.addEventListener('keydown', event => {
      if (event.key !== 'Tab') return;
      const controls = [...dialog.querySelectorAll('a[href],button,input')].filter(element => !element.closest('[hidden]'));
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
    dialog.querySelector('#vigilBadgeName').addEventListener('input', drawBadge);
    dialog.querySelector('#vigilBadgeDownload').addEventListener('click', () => {
      drawBadge();
      const anchor = document.createElement('a');
      anchor.href = dialog.querySelector('#vigilBadge').toDataURL('image/png');
      anchor.download = 'VIGIL-2027-attending.png';
      document.body.append(anchor); anchor.click(); anchor.remove();
    });
    drawBadge();
    return dialog;
  }
  function open(options) {
    if (!options || options.verified !== true) throw new Error('A verified registration success event is required.');
    if (!window.VigilCalendar) throw new Error('Calendar helper is unavailable.');
    passType = options.pass;
    const popup = mount();
    popup.querySelector('#vigilThanksGoogle').href = window.VigilCalendar.googleUrl;
    popup.querySelector('#vigilThanksIcs').onclick = window.VigilCalendar.downloadIcs;
    popup.querySelector('#vigilThanksUpgrade').hidden = passType !== 'free';
    lastFocus = document.activeElement;
    popup.showModal();
    popup.querySelector('.vigil-thanks-close').focus();
  }
  window.VigilThankYou = Object.freeze({ open });
})();
