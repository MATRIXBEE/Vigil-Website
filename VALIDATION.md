# VIGIL Summit 2027 · v3 validation

Tested 12 November 2026 against the local static site in the Codex Chromium browser.

## Source and logic checks

`node tests/verify.mjs` — **31 checks passed**. Uses only built-in Node modules.

Coverage: application syntax, structured data, exact registration destinations,
public placeholder removal, local asset paths, generated speaker portraits, hero
path, unique static IDs, duplicated marquee sequences, reduced-motion CSS,
timezone conversion (including midnight/date changes), three-digit days,
countdown opening/session/end boundaries, staged and reduced-motion flap updates,
ICS UTC times/recurrence/alarm/CRLF/UTF-8 folding, and Google Calendar URL fields.

A separate basic HTML tag-nesting and closure check found no mismatches. No broken
static in-page anchor targets were found. This is not a full HTML conformance audit.

This is buildless HTML/CSS/JavaScript: there is no framework compilation step or
package installation. Existing assets and the unrelated package-lock.json were
preserved. No dependencies were added.

## Browser checks completed

- Loaded the actual redesigned page and inspected the hero, countdown strip,
  Checkpoint result, chart and mobile layouts.
- Requested viewport widths 360, 390, 768, 1024 and 1440px. In each, the document
  had no measured horizontal overflow, the nine flap digits fitted their board,
  and the quiz card fitted its own content area. Chromium's vertical scrollbar
  uses approximately 15px of the requested viewport width.
- At 360px, inspected all three timezone rows and both calendar buttons; their
  content fitted their measured widths. At 768px the strip uses two columns; at
  1440px it uses four. At 1024px the hero height is 692px including navigation space.
- Inspected all four supplied faces in desktop and mobile hero crops. The source
  file is unchanged and is not a five-person standalone photograph.
- Completed the Checkpoint for Sentinel, Watcher, Starter, Builder and Navigator;
  results and highlighted archetype matched the existing scoring. Restart returned
  to Question 1 of 3. The pillar recommendation updated correctly.
- Selected Day 5 and verified its VIP CTA. Home-key navigation returned to Day 1.
- Selected Singapore and observed 22:00–01:00 with the next-day ending label;
  selected-day timing updated as well. Restored automatic timezone detection.
- Opened and closed the mobile menu; Escape closed it. The mobile registration
  link navigated successfully and the menu/scroll lock were closed after returning.
- Speaker Next advanced the rail, enabled Previous and updated the progress thumb.
  All nine portrait frames measured 4:5, had no clip-path, and contained one colour
  image. Original speaker files were not altered.
- Opened and closed an FAQ disclosure.
- Observed the marquee's running transform and matching group widths (1824px
  per group at desktop). Duplicate markup and -50% loop geometry were checked.
- Local-page console logs contained no captured warnings or errors during the
  completed tests. External Google pages are outside this console result.

## Registration click results

All **14 tested placements/states** reached exactly:
`https://summit.wearevigil.global/p/register`

1. Desktop navbar
2. Hero Register free
3. Hero VIP
4. Free pass card
5. VIP pass card
6. VIP+ pass card
7. Corporate pass card
8. Final CTA Register free
9. Final CTA VIP
10. Footer Register
11. Timeline free day
12. Timeline VIP day
13. FAQ corporate enquiry
14. Mobile-menu Register free

The official registration page itself loaded. No registration, payment or enquiry
was submitted. All live data-register anchors and all structured-data offers were
also checked for the exact URL.

## Calendar results

The Apple Calendar button downloaded `VIGIL-Summit-2027.ics` through the actual
browser interaction. Its downloaded bytes were checked:

- DTSTART 2027-03-01 14:00 UTC; DTEND 17:00 UTC.
- RRULE FREQ=DAILY;COUNT=5 (1–5 March).
- Display reminder 30 minutes before each session.
- CRLF content lines; maximum physical line length 75 UTF-8 octets.

The generated Google URL has the same UTC schedule and recurrence. Browser popup
activation was unreliable in this test environment. Opening the generated URL
directly reached Google's Calendar product/sign-in page in the signed-out browser.
The authenticated prefilled editor and calendar saving were **not verified**.
Import into Apple Calendar or Outlook was **not performed**.

## Captured proof

- screenshots/redesign-desktop-1440-hero.jpg
- screenshots/redesign-laptop-1024-hero.jpg
- screenshots/redesign-mobile-390-hero.jpg
- screenshots/redesign-mobile-360-countdown.jpg
- screenshots/redesign-tablet-768-countdown.jpg

Historical screenshots are preserved and do not represent the current redesign.

## Remaining limits

- Supplied hero PNG is byte-identical to the composite design reference and shows
  four people. A clean five-person photograph remains missing. No people, facial
  features, equipment or clothing were generated or altered.
- Reduced-motion paths were checked in source/logic tests; an OS-level preference
  toggle and screen-reader testing were not performed.
- Marquee loop geometry was verified; a precisely timed full-cycle recording and
  an automated hover/focus interaction check were not completed.
- Browser testing used one Chromium environment; Safari, Firefox and actual
  mobile hardware were not tested.
- Existing non-registration page routes and backend services are not implemented
  by this homepage project. Pending client content remains documented in NOTES.md.
