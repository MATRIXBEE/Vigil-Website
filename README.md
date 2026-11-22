# VIGIL Summit 2027 · v4

Existing homepage implementation, updated on 22 November 2026. This is a
buildless HTML/CSS/vanilla JavaScript project. The update keeps the approved v4
design and uses the supplied transparent sponsor artwork.

## Open the site

Open `index.html` directly, or serve this folder:

```text
python -m http.server 5501 --bind 127.0.0.1
```

Visit http://localhost:5501/. No npm installation or framework build is required.
Poppins loads from Google Fonts; external services require internet access.

## Current behaviour

- Team-image hero and a responsive four-area event/countdown strip.
- Split-flap countdown to 1 March 2027 at 14:00 UTC, with three day digits,
  per-second updates, zero clamping and reduced-motion handling.
- A GMT-only fixed schedule row, with optional local-time conversion including Sydney.
- Google Calendar event-template URL and Microsoft Outlook ICS download, covering
  1–5 March, daily 14:00–17:00 UTC, with a 30-minute reminder.
- Five agenda days: Vision, Diagnose, Challenge, Evidence in Practice and Blueprint
  Day. Days 1–4 have expandable GMT programmes; Blueprint Day presents three
  Roadmap Labs and two Masterclasses in parallel, without the detailed timeline.
  The room heading reads “14:00–17:00 — Choose a Room” (GMT).
- Three-question Checkpoint warm-up, answer recap, suggested sessions and restart.
  It does not score users, assign an archetype or send their answers anywhere.
- Fourteen speaker cards: ten supplied portraits, one reserved keynote card and
  three additional unnamed speaker slots.
- An "In Good Company" placeholder after the countdown, reserved for confirmed
  corporate attendee logos. It contains no company claims or carousel.
- Three Category Sponsors (FloCrunch, nuTheory and CTS Globe) and twelve distinct
  Summit Partners in a compact responsive grid. HeyLina replaces Ensured Safety;
  NEBOSH remains excluded. HAOP uses the same off-white card as every partner,
  with a separate transparent light-card asset and navy lettering.
- Morrisons, Cority and Unilever logos under the host's experience section.
  All displayed organisation logos have transparent image backgrounds.
- Nine FAQ disclosures, responsive navigation, speaker rail and scroll effects.

Free registration and Heartbeat links use
https://summit.wearevigil.global/p/register. Paid-pass CTAs use separate
invitations: VIP `GC647E`, VIP+ `683CEE`, and Corporate `C7GA72` at
`https://summit.wearevigil.global/invitation?code=...`. The Corporate card
also has a Request an Invoice email link to `ike@wearevigil.global`.

## Verification

```text
node tests/verify.mjs
node tests/content.mjs
python tests/browser_check.py
```

The Node suites use built-in modules only. The browser script requires Python
Playwright and Chromium, or an installed Chrome executable supplied through the
`CHROME` environment variable. Start the local server first. `VIGIL_URL` overrides
the page URL; `VIGIL_SHOTS` selects the screenshot directory.

The 17 and 18 November runs are recorded in `VALIDATION.md`, with evidence under
`verification/`. The 21 and 22 November updates are recorded separately there. Existing
`screenshots/v4-*.jpg` in the repository are earlier supplied v4 captures.
The 18 November review captures remain local and are excluded from the
production commit.

## Cleanup and publication

The earlier cleanup removed the then-unused HeyLina PNG/WebP and obsolete v3 archive.
The 18 November publication includes v4 source, required assets, tests,
documentation, curated v4 screenshots and portable validation results. Existing
Git history and remote are preserved. The 21 November sponsor and payment-link
updates were validated locally before release. The 22 November update includes
HeyLina, the HAOP light-card asset, schedule and speaker changes. GitHub and
Vercel show the current published revision.

Local ZIP deliveries, historical implementation diffs, generated browser captures
and machine-specific audit files are excluded from the source commit. They remain
available locally. Cleanup-era Git audit and preservation snapshots describe the
state before publication, rather than the current repository status.

The published site uses the existing Vercel project connected to MATRIXBEE/Vigil-Website,
with main as its production branch. Framework: Other; no build or install command;
output directory: `.`. See GitHub `main` and the Vercel production dashboard
for the current published revision.

## Known limitations

- The supplied hero is a composite reference with four visible people. CSS shows
  its photograph region; the source image is unchanged.
- HeyLina's supplied lime lettering has limited contrast on the required
  off-white card; its brand colour is preserved. HAOP's original transparent
  asset is retained, alongside a light-card copy with navy lettering.
- The presentation of "In Good Company" beyond this placeholder remains a design
  decision for discussion once corporate attendee logos are confirmed.
- The separately hosted VIP tickets page already has a Corporate section, but
  its editable source is unavailable here. Its required link and invoice updates
  are documented in `VIP-Landing-Page-Update.md`; that page is unchanged.
- The separate Gmail website-edits PDF was not present with this request; the
  latest connected email and its written corrections were reviewed.
- Some agenda speakers, Sarah Power/Powers spelling, the 2026 sample size and
  documented programme-duration conflicts still need client confirmation.
- Other inner pages remain outside this homepage build; existing `data-proto`
  links display a contact message. Registration links use the real external site.
- Registration, payments, Zoom/Heartbeat access, recordings, certificates and full
  Checkpoint reports are handled by external services, not this static homepage.
- Google Calendar saving, Outlook import, screen readers, non-Chromium browsers
  and physical devices are not implied by automated local verification.
- The final HAOP light-card browser run passed 240 checks at six widths with
  network access. See `VALIDATION.md` for the earlier restricted-network result.

`VIGIL-Implementation-Report.md` describes the implementation, cleanup and open
items. `NOTES.md` preserves the historical design/approval record; its old version
descriptions are not current v4 behaviour.
