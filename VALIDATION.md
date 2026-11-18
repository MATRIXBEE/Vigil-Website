# VIGIL Summit 2027 · v4 final validation

## 18 November 2026 local update

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
