# VIGIL Summit 2027 · v4 final validation

## Local timezone and speaker-filter update · 27 November 2026

The homepage event strip now displays GMT (2:00 PM – 5:00 PM), US Eastern
(EST, 9:00 AM – 12:00 PM) and Gulf (GST, 6:00 PM – 9:00 PM). Its optional
local-time calculator, UTC countdown and calendar actions remain in place.
The daily Agenda continues to show GMT. The Speakers directory offers Vision,
Tools & Systems, Data & Evidence, AI & Automation and Roadmap alongside its Day
filter. Vision uses confirmed Day 1 sessions, Roadmap uses confirmed Day 5
sessions, and the other pillars use existing session track assignments.
Unassigned sessions remain visible under All pillars.
The homepage carousel keeps Ike Aigbogun first and its reserved keynote card
last, without changing the order of the other speaker cards.

| Local check | Result |
| --- | --- |
| `node tests/verify.mjs` | 32/32 passed |
| `node tests/content.mjs` | 43/43 passed |
| `node tests/pages.mjs` | 9/9 passed |
| `python tests/browser_check.py` | 240/240 passed |
| `python tests/pages_browser_check.py` | 363/363 passed |

The browser checks used Chrome at 1440, 1366, 1024, 768, 390 and 375px.
They reported no horizontal overflow, missing local assets or browser console
errors. Homepage event-strip screenshots were compared before and after at
1440 and 390px; carousel start and end were inspected at desktop and mobile
widths. Screenshots are saved outside the repository. Registration
forms and external Tickets publishing were not exercised or changed. The
registration-confirmation dialog remains detached from production flows.

## Final predeployment checks · 24 November 2026

The current local checkout passed `node tests/verify.mjs` (32/32),
`node tests/content.mjs` (43/43) and `node tests/pages.mjs` (9/9).
Chrome with network access passed `python tests/browser_check.py` (240/240)
and `python tests/pages_browser_check.py` (315/315), with no missing local
assets, horizontal overflow, application console errors or blocked Google
Fonts requests. The browser checks covered six widths from 375px to 1440px.
These are local checks; production deployment and live verification are
reported separately.

# Local page implementation verification · 24 November 2026

This section records the pre-publication local verification of the 24 November
update. Older entries below are historical results for earlier versions and
releases.

| Check | Result |
| --- | --- |
| `node tests/verify.mjs` | 32/32 passed |
| `node tests/content.mjs` | 43/43 passed after updating the approved VIP+ wording assertion |
| `node tests/pages.mjs` | 9/9 passed |
| `python tests/pages_browser_check.py` | 315/315 passed across 1440, 1366, 1024, 768, 390 and 375px after the compact Speakers host update |
| `python tests/browser_check.py` | 234/240 passed in this restricted environment; six console-clean assertions failed because `fonts.googleapis.com` could not resolve, once per viewport |

The new-page browser checks directly loaded all four routes, decoded their
images, checked for horizontal overflow and local 4xx requests, exercised
mobile navigation, combined speaker filters, agenda days/tracks/history/hash,
calendar actions and the inactive thank-you fixture. They found no page script
errors or application console errors. All 25 recorded console resource errors
were blocked external Google Fonts requests in this environment. The homepage
browser results likewise show only the external font failure; its other 234
checks passed. No production browser or live registration form was tested in
this local run. The homepage's earlier unrestricted 240/240 run is historical
evidence, not a result of this run.

The Speakers follow-up uses rectangular portrait frames on that route only.
Its ten named cards keep their prior order, while the keynote and three other
unnamed slots sit in a separate section. The browser run checked named counts,
combined filters and the separate section at all six widths. The homepage
speaker rail was not changed for this follow-up.

Ike's featured host portrait now measures 240 × 300px on desktop and
180 × 225px on mobile. Browser geometry checks confirmed the directory's left
alignment, a 32px side gap on desktop, a 24px stacked gap on mobile and
vertical centring on desktop. Focused desktop and mobile captures were
visually inspected with her full face visible.

Desktop and mobile screenshots for Agenda, Speakers, About and Partners, plus
the dialog preview, were captured and visually inspected under the separate
Codex visualization folder `vigil-pages/` (outside this repository). The
current logo groupings and off-white cards appear intact. The screenshots use
a fallback font because Google Fonts was unavailable to the browser sandbox;
the site still requests its approved Poppins font. Safari, Firefox, physical
devices and screen-reader use remain untested.

No commit, push, deployment, purchase, registration or live enquiry was made
during this validation run.
The external tickets page, sponsor deck/form destination and Heartbeat success
callback remain outside this checkout or unverified.

## 22 November 2026 HAOP light-card follow-up

| Check | Result | Evidence |
|---|---|---|
| `node tests/verify.mjs` | 32 passed; exit 0 | `verification/node-verify-20261122.txt` |
| `node tests/content.mjs` | 43 passed; exit 0 | `verification/node-content-20261122.txt` |
| `python tests/browser_check.py` in the restricted sandbox | 234 passed, 6 failed; exit 1 | `verification/browser-results-20261122-haop.json` |
| `python tests/browser_check.py` with network access | 240 passed, 0 failed; exit 0 | `verification/browser-results-20261122-final.json` |

All six browser failures are the console check at each viewport. The browser
could not resolve the external Google Fonts URL in the restricted network;
there were no page JavaScript errors. The other checks passed, including the
HAOP light asset loading, genuine alpha, uniform off-white partner cards,
logo fit, no broken images and no horizontal overflow. The desktop and mobile
partner screenshots were visually inspected. The complete browser suite was
then rerun with network access against the final HAOP asset and passed all 240
checks at six widths with no console errors. The earlier 240/0 run below
predates the HAOP light-card asset.

Pixel comparison of `assets/sponsors/haop-light.webp` against the untouched
`haop.webp` confirms identical dimensions, full alpha channel and every
decoded wave pixel. Only the separated lettering region is navy `#172B3A`.
The new WebP is lossless with transparency and is used only on the off-white
Summit Partners card.

## 22 November 2026 local client update

| Command | Result | Evidence |
|---|---|---|
| `node tests/verify.mjs` | 32 passed; exit 0 | `verification/node-verify-20261122.txt` |
| `node tests/content.mjs` | 43 passed; exit 0 | `verification/node-content-20261122.txt` |
| `python tests/browser_check.py` | 240 passed, 0 failed; exit 0 | `verification/browser-results-20261122.json` |

The browser run used installed Chrome at 1440×900, 1366×768, 1024×768,
768×1024, 390×844 and 375×812. It checked the approved fifteen sponsor
logos, three experience logos, genuine transparent corners, matching Summit
Partner card styling, HeyLina replacing Ensured Safety, GMT-only fixed
schedule, Sydney local conversion, all five agenda days, the compact Day 5
heading and rooms, speaker placeholders, pass destinations, Corporate invoice
link, Outlook ICS and Google Calendar options, countdown, Checkpoint, FAQ,
navigation, image loading, horizontal overflow and console output. All
checks passed.

The first sandboxed browser run passed 234 checks but had six console failures:
Google Fonts could not resolve in the restricted test network. A read-only
request to Google Fonts returned HTTP 200 with network access; the complete
browser suite was rerun with network access and passed all 240 checks. The
client-provided HeyLina PNG and WebP, HAOP WebP and NEBOSH files were inspected
for actual alpha channels. HeyLina and HAOP have genuine transparency;
NEBOSH is opaque and remains excluded. The original source files were not
changed. These results were recorded before publication.

## 21 November 2026 local payment CTA update

| Command | Result | Evidence |
|---|---|---|
| `node tests/verify.mjs` | 32 passed; exit 0 | `verification/node-verify-20261121-payment.txt` |
| `node tests/content.mjs` | 43 passed; exit 0 | `verification/node-content-20261121-payment.txt` |
| `python tests/browser_check.py` | 228 passed, 0 failed; exit 0 | `verification/browser-results-20261121-payment.json` |

The browser suite covered 1440×900, 1366×768, 1024×768, 768×1024,
390×844 and 375×812 in installed Chrome. It checked each Free, VIP, VIP+
and Corporate CTA destination, the generated Day 5 VIP link, the visible
Corporate JOIN NOW and Request an Invoice actions, and the existing content,
image, navigation, countdown, agenda, Checkpoint, FAQ, overflow and console
checks. All passed. Read-only HTTP requests to the Free and three invitation
destinations returned 200. The invoice link's mailto address and encoded
subject were checked; opening a desktop email client was not part of the
browser suite.

The separate VIP tickets page was inspected: it already has a Corporate
section. Its editable source is unavailable in this repository, so its
requested link changes remain pending in `VIP-Landing-Page-Update.md`.
These checks were run locally before publication. GitHub and Vercel record
the later release outcome.

## 21 November 2026 local sponsor layout update

| Command | Result | Evidence |
|---|---|---|
| `node tests/verify.mjs` | 31 passed; exit 0 | `verification/node-verify-20261121.txt` |
| `node tests/content.mjs` | 42 passed; exit 0 | `verification/node-content-20261121.txt` |
| `python tests/browser_check.py` | 216 passed, 0 failed; exit 0 | `verification/browser-results-20261121.json` |

The browser suite used installed Chrome at 1440×900, 1366×768, 1024×768,
768×1024, 390×844 and 375×812. It checked the empty In Good Company area,
the three Category Sponsors, all twelve Summit Partners, the three separate
host experience logos, image loading and fit, responsive grid columns, no
horizontal overflow, countdown, agenda, Checkpoint, FAQ, registration URLs,
calendar actions, mobile navigation and console errors. All checks passed.
The fifteen displayed sponsor WebPs have transparent corners and total
1,098,270 bytes. Their supplied source artwork remains untouched.

The first browser run found a 4-pixel CTS Globe logo overflow in its mobile
tile. The tile height was adjusted and the full suite was rerun successfully.
The checks cover the local site before publication. GitHub and Vercel record
the later release outcome.

## 18 November 2026 published update (historical)

| Command | Result | Evidence |
|---|---|---|
| `node tests/verify.mjs` | 31 passed; exit 0 | `verification/node-verify-20261118.txt` |
| `node tests/content.mjs` | 41 passed; exit 0 | `verification/node-content-20261118.txt` |
| `python tests/browser_check.py` | 198 passed, 0 failed; exit 0 | `verification/browser-results-20261118.json` |

The browser suite used installed Chrome at 1440×900, 1366×768, 1024×768,
768×1024, 390×844 and 375×812. It checked all five agenda days, the
collapsed GMT programmes, the compact Blueprint Day, the 15 partner logos,
three experience logos, responsive navigation, registration destinations,
countdown, calendar actions, speakers, Checkpoint, FAQ, image loading,
horizontal overflow and console errors. Curated 18 November captures remain
local in `screenshots/v4-20261118-*.jpg` and are excluded from the production
commit.

The first browser run found two mobile logo containers whose images exceeded
their available height. The mobile CSS was corrected and the full suite was
rerun successfully. The original PNGs were kept; optimised WebP copies are
used by the page. These checks ran locally before publication; deployment
and live verification are reported separately.

## 17 November 2026 published baseline (historical)

Executed 17 November 2026 against the integrated local v4 implementation after
cleanup. These are fresh run results, not the supplied report's earlier claims.

## Final result

| Command | Result | Evidence |
|---|---|---|
| node tests/verify.mjs | 31 passed; exit 0 | verification/node-verify.txt |
| node tests/content.mjs | 37 passed; exit 0 | verification/node-content.txt |
| python tests/browser_check.py | 174 assertions passed, 0 failed; exit 0 | verification/browser-results.json |

Machine-readable summary: verification/final-summary.json. There is no frontend
build step. No production dependency was installed or changed. Browser QA used
Python Playwright 1.65.2 from an isolated temporary environment outside the repo,
and the existing Google Chrome installation.

## Browser viewport matrix

| Width | Height | Document/content overflow | Broken images / console errors | Blueprint room columns |
|---|---|---|---|---|
| 1440 | 900 | None measured | None | 5 |
| 1366 | 768 | None measured | None | 5 |
| 1024 | 768 | None measured | None | 3 |
| 768 | 1024 | None measured | None | 3 |
| 390 | 844 | None measured | None | 1 |
| 375 | 812 | None measured | None | 1 |

At all six widths, the final script verified:

- Nine split-flap digits fit and the seconds change; day count has three digits.
- All three fixed timezone rows fit and have equal heights.
- Registration links exist and all data-register targets equal exactly
  https://summit.wearevigil.global/p/register.
- All five agenda days render with the correct names, schedule-row counts
  (10/8/8/8/5), no overflowing panel content and five rooms only on Blueprint Day.
- The three-answer Checkpoint result contains its answer recap and full-assessment
  link; restart returns to Question 1 of 3. It assigns no score or archetype.
- FAQ opens and closes. The mobile menu opens and closes with Escape at applicable
  widths. The navigation returns to its real fixed positioning after capture CSS.
- Every speaker image finishes loading, there are eleven cards and one host image,
  and Next/Previous speaker controls update the scroll and button states.
- Outlook downloads VIGIL-Summit-2027.ics with the 14:00 UTC start and daily x5
  recurrence. The Google Calendar URL contains the same correct dates and rule.
- All requested images finish loading with no broken images, no failed local
  requests and no captured console errors or warnings.

Separate browser contexts verified that reduced motion stops marquee/flap
animation and that timeline End/Home select Blueprint Day/Vision.

The Node tests additionally execute countdown boundary and reduced-motion paths,
calendar escaping/folding and UTC duration/recurrence logic, timezone/date changes,
registration metadata, programme content, supplied speaker paths, FAQ wording and
public placeholder/removal expectations.

## Static asset and preservation checks

verification/assets.json records:

- No missing static or generated local asset references.
- No duplicate static IDs or broken in-page anchors.
- 54 remaining assets; 51 raster asset files passed image-integrity decoding.
- All three nuTheory comment slots retained.
- Only the two unused HeyLina assets and obsolete v3 ZIP removed.

verification/preservation.json compares against the pre-cleanup snapshot:

- index.html unchanged, SHA-256
  068c977576101fbe0e4d2a7bfc6b79d62188fb77d2bddfe16ee7efc4c28bfdc1.
- Every surviving asset and supplied screenshots/v4-*.jpg unchanged.
- Git HEAD, refs and remote configuration unchanged.
- No unexpected file modifications.

## Checker corrections and diagnostic history

The original supplied browser script was executed first. It exited 0 while merely
printing observations; portraitsLoaded was sampled before waiting for lazy images,
and wideEls included the intentionally clipped decorative CTA mark.

Only tests/browser_check.py was corrected: wait for image completion, exclude the
known decorative crop, restore temporary screenshot navigation styling, test
speaker arrows, wait for scroll-event state updates, and assert results before a
successful process exit. No production source was changed to satisfy tests.

- verification/browser-results-initial.json: initial unmodified checker output;
  retained diagnostic only, not the final pass record.
- verification/browser-results-pre-event-wait.json and matching stderr: a strict
  intermediate run that exposed an asynchronous test measurement race; retained.
- verification/browser-results.json: authoritative final run, 174 passed / 0 failed.
- verification/browser-stderr.txt: final run stderr (empty).

## Visual evidence

68 fresh PNG captures are retained in verification/browser-shots/, including
viewport, agenda, Checkpoint, event strip, speakers, host, partners, chart, passes,
FAQ and desktop/mobile full-page captures. Representative hero, countdown and
mobile Blueprint Day captures were visually inspected. Existing screenshots/v4-*.jpg
and earlier captures are retained, not relabelled as results of this run.

## Git and packaging

Only the three requested deletions were staged with git rm. Existing v4 changes
and new files remain available; none were discarded. No commit, push, reset,
rebase or remote change occurred. git fsck --full passed. See
verification/git-audit.md for the intended/untracked inventory.

VIGIL-Summit-2027-v4-final.zip is the complete source/evidence delivery. It excludes
.git, temporary environments and nested ZIPs. Its file manifest is verified against
the delivered bytes. Existing Git history remains in the original repository.

## Known verification and launch limits

- This run checks registration targets; it submits no registration, payment or
  enquiry. The preceding integration audit reached the official registration page
  in a representative live click; the browser script itself does not test that
  external page's forms.
- Google Calendar's authenticated editor/save and Outlook import were not tested.
  Calendar URL fields and the actual ICS download were tested.
- Safari, Firefox, physical devices and screen-reader use were not tested.
- nuTheory and employer logos remain unavailable; the supplied hero has four
  visible people. No replacement artwork was fabricated.
- Client confirmation items and programme-duration conflicts remain documented in
  VIGIL-Implementation-Report.md. Calendar times remain the approved 14:00–17:00 UTC.
- Inner pages and external Heartbeat/Zoom/payments/recordings/certificates/full
  Checkpoint services are outside the static homepage implementation. Their
  end-to-end operation is not certified by these passing local checks.


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
