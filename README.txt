VIGIL Summit 2027 · v4
Final cleanup · 17 November 2026

README.md is the complete current guide. The website is buildless HTML/CSS and
vanilla JavaScript; no npm installation or frontend build is required.

OPEN
  python -m http.server 5501 --bind 127.0.0.1
Visit http://localhost:5501/, or open index.html directly.
Poppins uses Google Fonts. External destinations require internet access.

VERIFY
  node tests/verify.mjs
  node tests/content.mjs
  python tests/browser_check.py
The Node checks need no packages. The browser check requires Python Playwright
and Chromium, or an installed Chrome path in the CHROME environment variable.
Start the server first. VIGIL_URL sets its URL; VIGIL_SHOTS sets the capture folder.
Actual final-run results and limits are in VALIDATION.md and verification/.

CURRENT V4
- Countdown: 1 March 2027, 14:00 UTC; fixed GMT/EST/GST and local-time conversion.
- Google Calendar template URL and Microsoft Outlook ICS (daily x5).
- Vision, Diagnose, Challenge, Evidence in Practice and Blueprint Day agendas.
- Blueprint Day: three Roadmap Labs and two Masterclasses in parallel.
- Three-question Checkpoint warm-up with no scoring or archetype; restart works.
- Eleven speaker cards: ten portraits and one reserved keynote slot.
- Five current partners, accessible looping marquee, nine FAQ disclosures.
- All registration CTAs: https://summit.wearevigil.global/p/register

CLEANUP
Only the two unused HeyLina logos and obsolete v3 ZIP were removed. The three
Git deletions are included in the v4 publication. V4 implementation and all
other assets, tests, reports and screenshots are preserved. README.md and the
implementation report describe known missing assets and external-service limits.

DELIVERY
VIGIL-Summit-2027-v4-final.zip is the complete source package, excluding .git,
temporary Python environments and nested ZIPs. Preserve the original repository.
