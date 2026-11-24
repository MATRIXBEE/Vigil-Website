# VIGIL Summit 2027 · Implementation Report

## 24 November 2026 page implementation

Four static routes were added for local review: `/speakers/`, `/agenda/`,
`/about/` and `/partners/`. They use the existing buildless hosting approach,
v4 palette and typography, approved portraits and logos, a shared page
stylesheet and a small shared navigation/calendar helper. The homepage rail,
timeline, countdown, Checkpoint and pricing mechanics remain in place. Its
directory and footer links now open completed routes; deferred links keep their
existing fallback. The approved VIP+ copy now names the four-week Digital
Sprint implementation clinics without the separate support-to-deliver claim.

The Speakers route has the current 14-card roster and combined day/track
filters. The Agenda route has five accessible day tabs, Days 2–4 track filters,
concise expandable public information and five simultaneous VIP-only Day 5
rooms. About reuses Ike's approved host details and experience logos. Partners
reuses the 2026 Checkpoint respondent chart, three Category Sponsors and twelve
Summit Partners, with an official email action. No sponsor deck or enquiry form
was linked because neither an approved deck nor a submission endpoint was
supplied.

An inactive registration confirmation component and local fixture were added
for review. The fixture simulates a provider success event to check the dialog,
calendar actions and browser-generated badge. No public page loads the
component or treats a URL query, visit or CTA click as proof of registration.
Activating it requires a verified Heartbeat success mechanism.

The separate `wearevigil.global/tickets` publisher is unavailable; its VIP
sales page, paid actions and Corporate invoice option were not edited here.
The existing homepage price remains $197 while the reported $147 early-bird
request awaits confirmation against the later brief and checkout. See
`VALIDATION.md` for the local test record. GitHub and Vercel show the current
publication state.

## 22 November 2026 client update

The existing v4 homepage was updated in place without changing its overall
design. The supplied transparent HeyLina artwork now replaces Ensured Safety
in the twelve-logo Summit Partners grid. FloCrunch, nuTheory and CTS Globe
remain the only Category Sponsors. NEBOSH remains excluded. All partner cards,
including HAOP, now use the same off-white background, radius and border
styling. HeyLina's lime mark remains in its original colour. The original
transparent `haop.webp` remains untouched with its white lettering. A
separate lossless `haop-light.webp` is displayed on the off-white card: only
the lettering changes to navy `#172B3A`. The decoded blue, orange and green
wave pixels, full alpha channel, dimensions, letter shapes and spacing were
checked against the original. HeyLina's light mark has limited contrast on
the required off-white surface. The three separate
experience logos remain Morrisons, Cority and Unilever. The displayed
organisation logo files have genuine transparency.

The fixed schedule now shows GMT only. The optional local-time calculator
still supports other locations, including Sydney, Australia. Google Calendar
and the five-day Outlook ICS export remain the two calendar actions. Day 5
keeps its five simultaneous rooms, VIP explanation and colour legend; the
room heading now reads **14:00–17:00 — Choose a Room (GMT)** without a detailed
Day 5 time breakdown. The proof and mini-Checkpoint sections call Data &
Evidence, Digital Tools & Systems, and AI & Automation **three lenses**, not
Checkpoint dimensions. The three-question warm-up still does not score or
assign an archetype.

Ike remains the first speaker with her approved photograph; Sarah and Claudia
remain in their previously approved swapped order. Three unnamed speaker
slots were added after the ten named speaker portraits, in addition to the
reserved keynote card. Ike's host description now says **UK-based**. No
speaker names, biographies, locations or session assignments were invented.
Free, VIP, VIP+ and Corporate destinations remain unchanged and correct;
Corporate still has separate JOIN NOW and Request an Invoice actions. The
At that time the VIP+ card used four-week Digital Sprint implementation
clinic and support-to-deliver wording; the 24 November local edit above removes
the latter. In Good Company remains an empty
corporate-attendee placeholder without a carousel or attendance claims.

Final verification passed **32 regression, 43 content and 240 browser checks**
at six desktop, tablet and mobile widths. The restricted-network browser run
passed 234 checks and failed six console checks because Google Fonts could not
resolve. The full browser suite was rerun with network access against the
final HAOP asset and passed all 240 checks with no console errors.
Details are in `VALIDATION.md` and the dated `verification/` results.

Changed in this update: `index.html`, `assets/sponsors/heylina.webp`,
`assets/sponsors/haop-light.webp`, the content
and browser tests, current documentation and dated validation evidence. The
source archive and original logo files were preserved. The separate VIP tickets page remains
outside this repository; its required link and Corporate action changes are
documented in `VIP-Landing-Page-Update.md` for its own editor. The In Good
Company logo presentation remains a client decision once attendees are
confirmed.

## 21 November 2026 payment CTA update (validated before release)

All homepage VIP CTAs, including the hero, pass card, closing CTA and generated
Blueprint Day panel, now point to
`https://summit.wearevigil.global/invitation?code=GC647E`. VIP+ points to
`https://summit.wearevigil.global/invitation?code=683CEE`. The Corporate card
now has a primary **JOIN NOW** button pointing to
`https://summit.wearevigil.global/invitation?code=C7GA72` and a separate
**Request an Invoice** mailto link to `ike@wearevigil.global` with the subject
“Corporate Pass Invoice Request – VIGIL Summit 2027”. Free registration and
Heartbeat links remain at `https://summit.wearevigil.global/p/register`.
The Event structured-data offer URLs match the pass destinations.

Final local checks passed **32 regression, 43 content and 228 browser checks,
with zero browser failures**. All four external pass destinations returned
HTTP 200 in read-only requests. Browser results cover six desktop and mobile
widths; see `VALIDATION.md` and `verification/` for evidence.

The separate [VIP tickets page](https://wearevigil.global/tickets) already has
a Corporate section. Its editable source and account access are unavailable
in this repository, so that page was not modified or duplicated. Exact changes
for its existing VIP, VIP+, Corporate and Free sections are recorded in
`VIP-Landing-Page-Update.md` for its editor. This report records the local
validation; GitHub and Vercel show the subsequent release status.

## 21 November 2026 sponsor layout update (validated before release)

The logo strip after the countdown is now **In Good Company**. It contains a
simple placeholder for confirmed corporate attendee logos, with no company
names, attendance claims or rotating carousel. Its final presentation remains
open for discussion when those logos are supplied.

The former Headline Sponsor placeholder is now **Category Sponsors**, showing
only FloCrunch, nuTheory and CTS Globe. The **Summit Partners** grid shows
AI in HSE, Ensured Safety, EvexSafety, FLOWforms, HAOP, HSZ Solutions,
KorviaOne, OwnThePrompt, QHSE Directory, SHEDAI, HSE Nations and SOWSHE-A.
It uses six columns and two rows on desktop, four columns and three rows on
tablets, and two columns on small screens. HeyLina and NEBOSH remain absent.

All fifteen displayed sponsor WebPs were remade from the supplied transparent
`logos.zip` artwork, cropped to visible bounds and optimised to about 1.1 MB
combined. The source archive and original artwork remain unchanged. The
logos retain their colours and proportions; HAOP uses a dark plate so its
white lettering remains visible. Morrisons, Cority and Unilever stay in the
separate host experience area and were not changed.

The final local runs passed **31 regression checks, 42 content checks and 216
browser checks with zero failures**. The browser suite covered six desktop,
tablet and mobile widths; details and evidence are in `VALIDATION.md` and
`verification/`. The first run found a four-pixel CTS Globe overflow on mobile;
the tile height was corrected before the full passing rerun.

Changed locally: `index.html`, fifteen `assets/sponsors/*.webp` files,
`tests/verify.mjs`, `tests/content.mjs`, `tests/browser_check.py`, `README.md`,
`README.txt`, `NOTES.md`, `VALIDATION.md` and this report. Existing Git history
was preserved during implementation. GitHub and Vercel show the release
status. The 18 November report below describes the prior published version.

## 18 November 2026 published update (historical)

The v4 homepage now displays **15 distinct partners** in both the accessible
marquee and the static Partners grid. The original five remain: FloCrunch,
QHSE Directory, CTS Globe, HSE Nations and SHEDAI. The ten additions are
AI in HSE, Ensured Safety, EvexSafety, FLOWforms, HAOP, HSZ Solutions,
KorviaOne, OwnThePrompt, nuTheory and SOWSHE-A. Each uses the supplied artwork;
optimised WebP copies were created while the original PNGs remain intact.
HeyLina remains excluded from the website. A prominent, responsive Headline
Sponsor area says "Reserved for Headline Sponsor" and claims no sponsor.

The host section now displays the supplied Morrisons, Cority and Unilever
logos from `assets/experience/`. The files were visually checked: the
SOWSHE-A sponsor logo is separate from the Unilever experience logo.

Ike's latest email removes the separate ongoing-support VIP+ benefit and
the Tools & Systems Roadmap Lab co-facilitator placeholder. VIP+ now names
the four-week Digital Sprint implementation clinics and support to deliver
the attendee's plan. Blueprint Day retains its five simultaneous rooms,
choice of one primary experience, closing overview, VIP labels and pillar
legend. Its detailed timeline is removed, and the room header reads
**14:00–17:00 GMT**. The chart highlights C-suite / Executive and Leader /
Manager; all percentages remain unchanged.

The five-day overview remains. Days 1–4 keep their approved programme
details inside collapsed disclosures for easier scanning. The full-schedule
CTA uses the verified Heartbeat registration URL. Day panel times display
GMT only; the separate local-time calculator still supports Australia and
automatic detection. Google Calendar, Outlook ICS, the Checkpoint links,
speaker order and responsive navigation remain in place. Partner copy now
uses "HSE decision-makers".

The final local runs passed **31 regression checks, 41 content checks and 198
browser checks with zero failures**, including the six specified widths.
Results are in `VALIDATION.md`. Curated screenshots remain local under
`screenshots/v4-20261118-*.jpg` and are excluded from the production commit.
The first browser run exposed two mobile logo fit failures; the mobile plate
height was corrected, and the complete suite passed on rerun.

Files modified: `index.html`, `tests/verify.mjs`, `tests/content.mjs`,
`tests/browser_check.py`, `README.md`, `README.txt`, `NOTES.md`,
`VALIDATION.md` and this report. Added to the production source: 10 optimised
partner WebPs, three experience WebPs and three dated validation files.
Five curated screenshots were saved locally for review.
The 10 supplied partner PNGs, three experience PNGs and HeyLina source PNG
remain untouched and untracked; no file was removed from the supplied assets.
The only removed files were two temporary contact sheets created for visual
inspection.

The 18 November changes were validated locally before publication. GitHub
`main` and the existing Vercel project record the published revision. The
17 November report below documents the previous baseline; its old logo and
test statements describe that earlier state. The separate website-edits PDF mentioned in the brief
was not included with this request. The latest connected Gmail thread was
reviewed, and the written brief specified its screenshot-based edits.
Remaining launch items are
the four-person composite hero, unconfirmed speakers and sample size,
programme-duration questions, unbuilt inner pages, and external ticket,
Heartbeat, Zoom and Checkpoint flows.

## 17 November 2026 published baseline (historical)

v4 · 17 November 2026 · Integrated implementation and final cleanup

## Summary

The approved homepage was updated in place: same single `index.html`, same design tokens, typography, components, animations and responsive breakpoints. No libraries were added. The five-day programme is rebuilt from the Speaker Guide v2 and Detailed Plan V3. The Checkpoint content now uses three dimensions, and the mini-Checkpoint no longer gives an archetype. Speakers, host, chart, passes, partners and FAQ are updated, and every registration link points to the Heartbeat registration page.

The final cleanup preserves index.html and the surviving assets byte for byte. Both Node suites were executed successfully after removal of the stale files: **31 regression + 37 content checks**. The final browser run passed **174 assertions with 0 failures**. Authoritative results and limits are recorded in VALIDATION.md and verification/browser-results.json.

## Client decisions applied

| Decision | How it was applied |
|---|---|
| A. Five pillars vs three lenses | The five-day programme identity is kept: the "Five pillars. Five days. One 90-day plan." heading, the timeline and the pillar legend. All Checkpoint-specific content now uses **Data & Evidence, Digital Tools & Systems, AI & Automation**: the Checkpoint section, the proof stat ("3 Checkpoint dimensions"), the FAQ, the footer boilerplate and the host "Data-first" line. Track order is Data → Tools → AI everywhere. |
| B. Ticket prices | The prices are kept: $0 / $197 / $997 / from $3,997 for up to 5 people, on the cards and in the Event structured data. All sponsorship tier prices are removed from the Partners section. |
| C. Mini-Checkpoint | It is still three questions: Data & Evidence, Digital Tools & Systems, and a focus question. There is no scoring, archetype or meter. The result introduces the full Checkpoint (30 questions, about 10 minutes, three dimensions), recaps the answers, suggests the matching sessions and has a clear "Take the full Checkpoint" button. A second button sits in the section intro. |
| D. Speakers | The order is: Ike Aigbogun, a reserved keynote card ("To be announced", using the VIGIL mark, no invented name or photo), then the original order with Sarah and Claudia swapped. Unconfirmed agenda speakers show as "To be announced", not by name. |

## What changed, by section

| Section | Change |
|---|---|
| Countdown strip | Labels are now GMT, **US Eastern (EST)** and **Gulf (GST)**, one line each with equal card heights. Units are DAYS, HOURS, MINS, SECS. The Apple Calendar button is replaced by **Microsoft Outlook**, which downloads a .ics file with all five days (RRULE). The India (IST) option is removed from the local-time list, and Sydney stays. The calendar text now points to Heartbeat. The split-flap countdown logic is unchanged and still targets 1 Mar 2027 14:00 UTC. |
| Fixed time lines | "ET" becomes "EST" in the mobile menu, final CTA, footer and the New York calculator label. |
| End-of-summit message | "Recordings are for VIP pass holders" is replaced by "Thank you for taking part", because Free passes now include recordings. |
| Agenda (5 days) | Each day now has its own purpose, a track or pillar column, session formats, a "You leave with" outcome and a full timed GMT programme. The names are Vision, **Diagnose**, Challenge, **Evidence in Practice** and **Blueprint Day**. Day 3 uses "Challenge Voices" and the approved description. Day 2 has track-specific descriptions and an interim-data caveat. Days 2–4 are labelled "one after another", as the workbook says these are sequential plenaries. The old "parallel tracks" label was wrong. |
| Day 5 | Five cards: three Roadmap Labs and two Masterclasses. Each card has a type label, facilitator, description, outcome and VIP tag. A "14:15 ——— 16:30 GMT" bar above the cards shows the rooms run in parallel. The schedule groups the parallel introductions and working sessions under their shared time slot. |
| Checkpoint section | The three dimensions, what you get and the full Checkpoint button are new. The archetype ladder is removed. |
| Speakers | New order. Each card shows that speaker's sessions from the programme; no roles or organisations were invented. The "Speak at VIGIL / Open slots" card is removed. Ike's 4:5 portrait is cropped from her existing host photo and not otherwise edited. |
| Host | The title is now "HSE Digital Transformation & Workforce Capability Specialist", and "London-based" is gone. The "Independent" card is replaced by "Digital specialist", while the independence promise stays in Partners. "Experience built across" lists Morrisons, Cority and Unilever as text (see missing assets). The photo shows natural colour only: the duotone-to-colour hover is removed. |
| Who attends | The order is now C-suite / Executive, Leader / Manager, Advisor / Officer, HSE Consultant, Operations / Site, Other. The values are unchanged and total 100.0%. The source line says these are 2026 Checkpoint respondents, not confirmed 2027 attendees. |
| Passes | Benefits follow the brief. Free gets 48-hour recordings. VIP gets Blueprint Day, Labs and Masterclasses, live Zoom rooms, a CPD certificate, platform access and recordings. VIP+ gets 4-week implementation clinics and ongoing support. Corporate is VIP+ for up to 5 people, with team access and a CPD certificate each. |
| Partners | HeyLina is removed from the marquee and the grid, and its asset files are deleted. The tier price list is removed. "Partner with VIGIL" now opens an email to ike@wearevigil.global. |
| FAQ | The seven approved answers are used word for word. Q2's "Join Heartbeat." links to the registration page, Q5 links to the existing Checkpoint URL and Q7 has the partner email link. Two existing questions are kept and updated: "What is VIGIL Summit 2027?" and "Which days are free?". |
| Footer | "Speak at VIGIL" is removed. The Checkpoint link goes to the Checkpoint URL. The boilerplate uses the three dimensions. |

## Final cleanup and testing

The delivered v4 homepage was preserved; no approved page content, layout, typography, colours, spacing or production JavaScript/CSS was changed during cleanup.

### Cleanup

- Removed unused assets/sponsors/heylina.png and assets/sponsors/heylina.webp after checking runtime references. The two historical names remain only in documentation, tests and the original diff.
- Removed VIGIL-Summit-2027-updated.zip because it contained v3. A new, distinctly named VIGIL-Summit-2027-v4-final.zip is the delivery archive.
- Used targeted git rm for only those three files. Their deletions are staged. No other files were staged automatically; no commit, push or history/remote change was made.
- Added README.md, updated README.txt, NOTES.md and VALIDATION.md, and retained all v4 source, screenshots, tests, reports and required artwork.
- Preserved the three nuTheory slots and every unrelated sponsor asset. Other unused square/duotone images and historical captures are retained.

### Executed checks

- node tests/verify.mjs: **31 passed**, exit 0. Evidence: verification/node-verify.txt.
- node tests/content.mjs: **37 passed**, exit 0. Evidence: verification/node-content.txt. The stale HeyLina file-removal failure is resolved.
- tests/browser_check.py: **174 browser assertions passed, 0 failed; exit 0**, at 1440, 1366, 1024, 768, 390 and 375px. Executed against localhost with installed Google Chrome and a temporary, external Python Playwright environment. The viewport matrix and limits are in VALIDATION.md; raw results are in verification/browser-results.json.
- Static asset inventory, image integrity, duplicate IDs and local anchor checks are in verification/assets.json.
- Git state, intended/untracked file inventory and staging scope are in verification/git-audit.md. Source/asset preservation is recorded in verification/preservation.json.

### Verification-script corrections (no website changes)

The original browser script was run first. It exited 0 but only printed observations. It read portraitsLoaded before requesting/waiting for lazy images, and its wide-element diagnostic included the intentionally clipped decorative CTA mark. The checker now waits for image decoding, excludes that decorative crop from content-overflow diagnostics, restores temporary navigation capture styling, verifies speaker next/previous controls, and exits nonzero when verified conditions fail. Speaker control checks wait for their scroll-event state update rather than reading a transient button state.

Initial diagnostic outputs are retained separately from the authoritative final JSON. Fresh screenshots are in verification/browser-shots/. Supplied screenshots/v4-*.jpg remain unchanged historical evidence of the supplied implementation.

### Verification limits

The browser script verifies all registration targets and the Google Calendar URL, and downloads the Outlook ICS. It does not submit registrations/payments, save a Google event, import into Outlook, complete the external Checkpoint or exercise protected Heartbeat/Zoom access. The preceding integration audit reached the real registration page in a representative click; no account details or submissions were sent. Safari, Firefox, physical devices and screen-reader behaviour are not certified by this Chromium run.

### Release scope

This is a verified static homepage source package, not certification that external event delivery or all inner pages are implemented. The confirmation items, missing assets and external-service limits below remain launch considerations. No substitute logos, photographs or event facts were fabricated.

## Items to confirm

1. **Sarah's surname.** The site shows **Sarah Power**, as in the brief and the workbook. Her photo files are named `sarah-powers`. Please confirm Power or Powers.
2. **Agenda slots shown as "To be announced":**
   - Day 1 keynote: the workbook says the speaker needs clear confirmation.
   - Day 4 Data & Evidence case study: only a first name is given.
   - Day 4 Tools & Systems case study: the speaker is "pending", with an alternative also mentioned.
   - Day 5 Tools Lab co-facilitator: only a first name is given.

   Sponsor guests in the Day 2 and Day 4 cross-lens sessions are also left out, because the sponsors are not confirmed.
3. **Day 1 keynote title** is published as "(working title)", because the workbook marks the topic as TBC.
4. **Day 1, 16:35** is shown as "Plan for the week". The "AI summit companion" is left out because Open Item 5 says how it works is still undecided.
5. **Timing conflicts** (Detailed Plan times are used as supplied):
   - Day 5 is 150–160 minutes ("AM or PM session") in the Daily Overview but 14:00–17:00 in the Detailed Plan.
   - On Days 2–4 the 16:50 close lasts 15 minutes, so it ends at 17:05, past the 3-hour calendar slot.
6. **Chart labels.** "HSE Manager" is relabelled "Leader / Manager" and "HSE Advisor / Officer" is now "Advisor / Officer", as the brief asks. The 2026 sample size is still unconfirmed.
7. **Wording drawn from the brief:**
   - Day 5 Roadmap Lab descriptions use the Speaker Guide's format line.
   - The one-line dimension descriptions in the Checkpoint section are short summaries of the brief's Day 2 track text.
   - Speaker session lines come from the programme.
8. **Checkpoint URL.** `checkpoint.wearevigil.global` is the existing link. It is not verified as Ike's Cloudflare Checkpoint page.
9. **Partner enquiries** go to ike@wearevigil.global. No sponsor deck link or enquiry form was supplied.
10. **Local-time calculator.** IST is gone from the list, but automatic detection still shows each visitor their own zone, so a visitor in India sees IST there.
11. **Latest boss email.** It was not supplied, so the written brief was treated as its summary.
12. **Not in this update:**
    - the 13 Nov "HSE decision-makers" partner wording (waiting on the deck wording)
    - the VIP sales page and other inner pages
    - the thank-you pop-up

    Links to unbuilt pages still show the existing "contact" message.

## Missing assets (nothing was fabricated or substituted)

| Asset | Current state |
|---|---|
| nuTheory logo | It is not shown yet. Commented slots are ready in the marquee (both groups) and the Partners grid. |
| Morrisons, Cority and Unilever logos | The names are shown as plain-text chips under "Experience built across". Swap in the approved logo files when supplied. |
| Five-person hero photograph | The supplied `vigil-hero-team.png` shows four people and is unchanged. A clean five-person photo is still needed. |
| Sponsor deck link | Not supplied. |

## Functionality that needs backend or external setup

This build doesn't connect to any of these; the site only links out:
- Heartbeat registration and access
- payments for paid passes
- Zoom joining links
- recordings and their 48-hour or VIP access rules
- CPD certificates
- Checkpoint results and reports

The mini-Checkpoint keeps answers only in the browser and sends nothing.

## Files and delivery inventory

### Supplied v4 work preserved

- index.html and tests/verify.mjs retain the supplied v4 implementation.
- tests/content.mjs, assets/speakers/ike-aigbogun-portrait.webp, all 18 screenshots/v4-*.jpg and this implementation report are included.
- v4-changes.diff is the original v3-to-v4 implementation diff. It is retained as history and does not include this final cleanup.
- All other surviving assets, historical screenshots, package-lock.json and .vscode/settings.json are retained.

### Final cleanup changes

- Removed and staged: assets/sponsors/heylina.png, assets/sponsors/heylina.webp, VIGIL-Summit-2027-updated.zip.
- Modified documentation: README.txt, NOTES.md, VALIDATION.md and VIGIL-Implementation-Report.md.
- Modified verification only: tests/browser_check.py (accurate image/overflow/scroll measurements and failing exit status).
- Added: README.md and verification/ evidence, inventories and fresh browser captures.
- Delivery: VIGIL-Summit-2027-v4-final.zip, containing the complete intended project and evidence with no nested ZIP, .git metadata or temporary environments.

The existing repository, initial commit, branch refs, reflog and remote configuration remain on disk. .git is deliberately not distributed in the source ZIP; do not replace or reset the original repository from an archive. See verification/git-audit.md for intended v4 files that remain untracked and should be considered in a future, separately approved commit.


## Publication preparation · 17 November 2026

The cleanup-era staging and no-push statements above are historical snapshots.
Publication includes the approved v4 source, required assets, tests, documentation,
18 curated v4 screenshots and portable final validation evidence. Local delivery
ZIPs, v4-changes.diff, generated browser captures and machine-specific audits are
retained locally and excluded from the publication commit. Existing tracked
historical assets remain preserved. Git history and the remote are unchanged.
Vercel uses the existing vigil-website project and main production branch, with
Other framework, empty build/install commands and output directory `.`.
Post-push deployment and live verification results are reported separately.
