# VIGIL Summit 2027 · Implementation update

17 November 2026 · v4 · Content and programme update to the approved v3 homepage

The full v4 record (changes, decisions A–D, items to confirm, missing assets, backend limits) is in
`VIGIL-Implementation-Report.md`. Key points:

- Agenda rebuilt from Speaker Guide v2 + Detailed Plan V3: Vision, Diagnose, Challenge (Challenge Voices), Evidence in Practice, Blueprint Day (five parallel rooms).
- Checkpoint content uses three dimensions; the mini-Checkpoint no longer assigns an archetype.
- Speakers: Ike first, reserved keynote card, Sarah and Claudia swapped; unconfirmed agenda speakers shown as "To be announced".
- Prices retained; sponsorship prices removed; HeyLina removed (nuTheory logo still needed).
- Confirm Sarah's surname (Power vs Powers).


## Final cleanup · 17 November 2026

- Removed unused assets/sponsors/heylina.png and heylina.webp after checking live source references. Historical notes and removal tests still mention the old partner; they do not load its files.
- Removed the obsolete v3 VIGIL-Summit-2027-updated.zip. These three deletions are staged with git rm; there is no commit or push.
- The v4 index.html and all remaining assets are preserved. The three nuTheory comment slots (two marquee groups and the Partners grid) are intact.
- Added README.md as the current guide and updated README.txt, VALIDATION.md and the implementation report.
- The original browser checker was executed, then its QA-only measurements were corrected: wait for lazy images before checking them, exclude the intentionally clipped background mark from content-overflow warnings, restore the fixed nav after capture styling, test speaker arrows and fail the process when a condition fails. No website code or approved content was changed.
- Both Node suites were executed successfully after cleanup: 31 regression checks and 37 content checks. Final browser-run details, evidence and explicit limits are in VALIDATION.md and verification/.
- Playwright was installed only in a temporary Python environment outside the repository and used the already-installed Chrome browser. No production package dependency was added.
- All supplied v4 screenshots, tests, reports, the new Ike portrait and the original v4-changes.diff are retained. Older unused variants and historical screenshots are retained as well.
- Current open items are the v4 report's confirmation/missing-asset list. The v1–v3 approval notes below are historical provenance, not a list of current v4 behaviour or approvals.

---

# Historical v3 record

12 November 2026 · v3 · Existing homepage redesign

## v3 implementation (historical; superseded by v4)

- New hero and four-area countdown strip are implemented in the existing index.html.
- Every free, VIP, VIP+, Corporate, timeline and footer registration CTA now links directly to https://summit.wearevigil.global/p/register. The old local registration simulation is removed.
- Yellow review notes, review switch, bracketed placeholders and internal approval messages are removed from the page. Pending facts remain recorded below; removing a marker does not approve its content.
- The unverified benchmark statistic is replaced with a non-numeric live-online fact. Four statistic columns are retained on desktop.
- Unapproved VIP+/Corporate benefits, host quote/credentials/disclosure and unconfirmed speaker role/organisation/session labels are omitted. No replacement factual claims were invented.
- Day 5 uses the confirmed pillar name Roadmap in public copy rather than the unapproved suggested name Roadmap Labs.
- The five existing archetypes, descriptions and quiz scoring remain intact. A concise assessment disclaimer remains; the old email simulation is omitted because there is no delivery service.
- Speaker cards show the supplied colour 4:5 photographs. Existing duotone and square files are preserved.
- Sponsor plates are larger; the existing duplicated CSS marquee, focus/hover pause and reduced-motion grid are retained.
- The countdown keeps three day digits, updates changed digits only, clamps to zero, retains the event-status message and clears timers on page exit. Calendar content lines are folded at 75 UTF-8 octets.
- Local/source tests and browser observations are recorded in VALIDATION.md. Historical v2 test claims below are not the v3 test results.

## Supplied hero artwork limitation

The exact requested assets/images/vigil-hero-team.png is 1774 x 887 and is byte-identical to the supplied hero design-reference PNG. It contains baked-in navigation/copy and FOUR visible professionals, not five. CSS crops only its photographic region and blends the edges. The file and people were not edited, recoloured or regenerated. All four existing faces remain visible in the inspected desktop/mobile layouts. A clean five-person source photograph is still required if five people are mandatory. Do not substitute an invented fifth person.

## Calendar verification limit

The Apple Calendar button downloaded an ICS file and its schedule/format passed checks. Import into Apple Calendar/Outlook was not performed. The Google Calendar URL contains the correct prefilled UTC times and five-day recurrence; the signed-out browser redirected the destination to Google's Calendar product/sign-in page, so the authenticated event composer/save was not verified.

---

# Historical v1/v2 approval and design record

The material below is retained for provenance. Its implementation descriptions and old registration routes are superseded by v4 above. Use the v4 report for current open items; old approval notes are retained only as a dated record.

# VIGIL Summit 2027 · Homepage prototype notes

v2 · 3 November 2026 · For review with Ike Aigbogun

## v2 · Design refinements (four changes)

1. **Hero countdown is now a split-flap display.** It shows Days (3 digits), Hours, Minutes and Seconds (2 digits each, with leading zeros), labels underneath.
   - Each digit is a Deep flap with a top and bottom half, a dark split line, a faint teal border and a teal rule under each unit.
   - When a digit changes, its top half falls and the new bottom half lands, using a 3D CSS rotation (about 0.6s). Only digits that change flip.
   - It runs on the same countdown calculation and target as before: 1 March 2027, 2:00pm GMT.
   - Flap size comes from the time card's width (CSS container units), so all nine digits fit at every width with no layout shift: 40px digits at 1440, 28px at 390, 25px at 360.
   - With reduced motion, the digits change without flipping. Screen readers get a once-a-minute text summary instead of the moving digits.
   - The time card is slightly wider (hero columns 1.15 : 0.95, previously 1.25 : 0.85) so the flaps read well on desktop.
2. **The current-partners strip is now a large infinite marquee.**
   - It shows the same six partner logos on consistent 240 × 104px plates (180 × 84px on mobile). Logos fill up to about 60–76% of the plate height and keep their aspect ratio. HeyLina stays on its dark plate.
   - The loop is seamless: two identical groups slide −50% in a pure CSS animation, with soft edge fades. The second group is hidden from screen readers.
   - It pauses on hover and on keyboard focus (the strip is focusable), then resumes.
   - With reduced motion, it becomes a static logo grid.
   - The lower Partners section is unchanged.
3. **The Checkpoint layout is re-balanced.**
   - The grid is now about 42 / 58 with a controlled gap. The question card is 540px max, centred in its column and vertically centred against the left content.
   - Answer buttons are at least 54px tall.
   - On mobile it stacks and the card is centred.
   - The questions, scoring, result, meter, restart and disclaimer are unchanged.
4. **Speaker photos are now rectangular.**
   - The triangle clip has been removed from the speaker cards. Portraits are 4:5 (new `*-portrait.webp` crops made from the original photos, so faces and heads are fully visible), all the same size, duotone with colour on hover.
   - The VIGIL triangle now sits *behind* each photo, offset top-right (z-index −1), so it never covers a face.
   - Name, role placeholder, session label, rail navigation and progress bar are all unchanged.
   - The host portrait in section 08 still uses the V-frame, since only the speaker cards were in scope. It can be switched to the same rectangular style if you prefer.

Nothing else changed: content, sections, colours, registration panel, time zones, calendar, timeline, FAQ and navigation are as in v1. The earlier assets are all kept.

---

## v1 notes (still current)

Sources used: Developer Context Brief (MD + PDF, incl. sitemap), Brand Identity Guidelines v1.0 (PDF + PPTX, all 22 slides), Homepage Wireframe v1 (31 Oct 2026, incl. build notes and scripts), speaker photos ZIP and sponsor logos ZIP.

Nothing in the prototype invents numbers, speaker roles, organisations, biographies or pass benefits. Every unconfirmed item is shown as a labelled placeholder. Switch **Review notes** on to see them all.

---

## 1. Pending Ike's approval (shown, flagged)

| Item | Where | What's shown now |
| --- | --- | --- |
| VIP+ value wording | Passes | Wireframe wording: Everything in VIP · 4-week post-VIGIL Sprint · Support to deliver your 90-day plan |
| Corporate value wording, invoicing | Passes | Wireframe wording: VIP+ for your team · One plan, built together |
| "Most popular" label on VIP | Passes | **Not used.** Replaced with the factual tag "Includes Day 5" |
| Time line with KSA and Qatar added | Hero | Official line stays GMT · ET · Gulf. KSA and Qatar are available in the time-zone selector only |
| One name for Day 5 | Timeline, Passes, FAQ | "Roadmap Labs" (suggested name) |
| Host headline | Host | "The practitioner who built the benchmark." |
| Flocrunch disclosure line | Host | "Ike also founded Flocrunch, a VIGIL partner. VIGIL's programme is independent of every partner, including hers." |
| Mini-Checkpoint questions and scoring | Checkpoint | Wireframe draft (3 questions, 0–6 score) |
| Archetype descriptions | Checkpoint | Brand kit slide 11 wording (see contradictions) |
| Pillar questions | Timeline | Brand kit slide 10 drafts |
| Advisory Council | About page | Not on the homepage |

## 2. Needed from Ike (placeholders)

- Real numbers for the proof strip: Checkpoint responses / HSE teams benchmarked, with year and sample. Countries and registrations are also needed, but are left off the strip until real figures exist.
- The sample size (n) for the 2026 role-mix chart.
- Confirmed speakers: roles, organisations, sessions, days and pillars. Session lengths too.
- Ike's credentials, memberships, quote, and any further photos.
- Payment method for paid passes.
- How registrants receive the Zoom link (FAQ, registration and calendar text).
- Approved logo SVG files and partner logo files.
- LinkedIn handle and social links (footer).

## 3. Contradictions and decisions taken

1. **Archetype descriptions differ.** The wireframe has "Paper-based and reactive / First digital steps, mostly manual / …". The brand kit has "Aware of the shift, not yet acting / First digital tools in place / …". I used the **brand kit** wording and flagged it.
2. **Role mix.** The brief gives three figures (41.3 / 23.8 / 17.5%). The wireframe and brand slide 13 give all six rows (adding Other 7.9, HSE Consultant 6.3, Operations/Site 3.2). All six are shown; n is still a placeholder.
3. **Speaker files vs. brief.** The brief lists confirmed speakers as "placeholder: needed from Ike". The supplied photos are used with names from their filenames only. Roles and sessions are placeholders. Because no speaker has a confirmed pillar or day, **the wireframe's pillar filter is replaced by a scrollable rail** (prev/next, keyboard, progress bar). Tagging real people with made-up pillars would be invented data. Once sessions are confirmed, add the Finsweet List Filter as the wireframe specifies.
4. **Ike Aigbogun's photo** is in the speakers ZIP. It is used in the Host section, not in the speaker rail.
5. **Proof strip.** The wireframe has two placeholder stats (teams benchmarked, countries). To avoid an empty-looking strip, I show three confirmed, sourced facts (15 hours = 5 × 3; 5 pillars; 4 free days) plus one placeholder (HSE teams benchmarked).
6. **"Live Q&A in sessions"** (wireframe Free pass) is not in the brief, so I left it out.
7. **Logo.** The PPTX contains only flattened slide images. The PDF contains the redrawn vector logo, so its exact paths (mark + wordmark, page 5) were extracted to `assets/branding/`. **Treat these as temporary until Ike supplies the approved SVG files.** They are not recoloured, stretched or retyped.
8. **HeyLina logo.** The supplied artwork is light lime on white (it has almost no contrast on a light plate). It sits on a dark plate instead. The colours are untouched.
9. **Footer year** is "© 2027 VIGIL", as in the wireframe.

## 4. Speaker inventory (main speakers .zip)

All supplied as PNG, RGB, 3114 × 4194 px. v2 speaker cards use 720 × 900 (4:5) WebP crops, `*-portrait.webp` and `*-portrait-duo.webp`. The v1 900 × 900 square crops are kept. The originals stay in the source ZIP.

| File | Name used | Used in |
| --- | --- | --- |
| Bulat Almukhametov.png | Bulat Almukhametov | Speaker rail |
| Claudia Soares.png | Claudia Soares | Speaker rail |
| Funmi Adegbola.png | Funmi Adegbola | Speaker rail |
| Ike Aigbogun.png | Ike Aigbogun | Host section (1100 × 1100 crop, colour + duotone) |
| Isaac Ochulor.png | Isaac Ochulor | Speaker rail |
| Jaina Ko.png | Jaina Ko | Speaker rail |
| Sarah Powers.png | Sarah Powers | Speaker rail |
| Subhrajeet Patra.png | Subhrajeet Patra | Speaker rail |
| Supriya Naidu.png | Supriya Naidu | Speaker rail |
| Zoe Borde.png | Zoe Borde | Speaker rail |

Speaker portraits (v2) are rectangular 4:5, in duotone by default and colour on hover. The host portrait sits in the V-frame.

## 5. Sponsor logo inventory (sponsor logos.zip)

All supplied as PNG, RGB (no transparency), 17280 × 8640 px, on white with large margins. For the six current partners: trimmed, outer white made transparent, resized to max 640 × 240 (WebP + PNG).

| File | Status in the brief | Shown on homepage |
| --- | --- | --- |
| flocrunch.png | Current partner | Yes |
| QHSE Directory.png | Current partner | Yes |
| CTS.png ("CTS Globe" artwork) | Current partner | Yes |
| HeyLina.png | Current partner | Yes (dark plate) |
| hse nations.png | Current partner | Yes |
| SHEDAI.png | Current partner | Yes |
| AI in HSE.png | Not listed | No |
| EnsuredSafety.png | Not listed | No |
| EvexSafety.png | Not listed | No |
| FLOWforms.png | Not listed | No |
| HAOP.png | Not listed | No |
| HSZ Solutions.png | Not listed | No |
| KorviaOne.png | Not listed | No |
| MoveMonkey.png | Not listed | No |
| OwnThePrompt.png | Not listed | No |
| nu Theory.png | Not listed | No |
| nu theory white.png | Not listed (white artwork on white, blank when previewed) | No |

## 6. Brand compliance

- Colours: the exact tokens from the brand kit. Night is the background, Deep for surfaces, Teal for accents and CTAs. Signal yellow appears only in the review markers, which are not part of the live site; no yellow is used in the design itself. Pillar colours appear only in the timeline and legend.
- Type: Poppins only. Bold for display and headlines, Medium for subheads, labels and buttons, Light for body.
- Graphic devices used: triangle marker, streak underline (one key word per section), streak timeline (bottom-left to top-right), oversize mark crop (hero, final CTA), V-frame portrait (host). From v2, speaker cards use rectangular photos with the triangle placed behind them. No other icons or decorations. The arrows on buttons and the rail are functional UI, not decoration.
- Charts: ranked horizontal bars, teal key bar, slate for the rest, values labelled directly, source line below.
- Motion: quiet scroll reveals, streak draw-in, count-ups and bar growth. All of it is disabled under `prefers-reduced-motion`.
- Copy: UK English, sentence-case headlines, exact key lines and boilerplate, "five pillars" throughout, times always GMT first.

## 7. Webflow build mapping

| Prototype piece | Webflow build |
| --- | --- |
| Hero (`data-hero="summit"`) | Swappable hero component; Report-led version replaces it from April |
| Time zone, countdown, calendar | One custom-code embed (`#vigil-time`); JS block is reusable |
| Streak timeline | Webflow Tabs styled as markers + Interactions (GSAP); content from the `Days` CMS |
| Mini-Checkpoint | Custom-code embed (`#vigil-mini-check`); email = native Webflow form with hidden `archetype` and `pillar` fields |
| Speaker rail | `Speakers` CMS list, "Featured on home"; add Finsweet List Filter once pillars exist |
| Split-flap countdown | Part of the `#vigil-time` embed (CSS + about 1.5 KB JS) |
| Partner marquee | Static HTML/CSS in a Symbol, or a `Partners` CMS list rendered twice (second copy `aria-hidden`) |
| Who attends bars | Static HTML bars, numbers edited by Ike |
| Passes | Static cards; buttons go to `/register?pass=free/vip/vipplus/corporate` |
| Partners | `Partners` CMS, "Show on home" switch |
| FAQ | `FAQs` CMS, "Show on home" switch |
| Register panel | Stands in for the `/register` page and native form; thank-you page gets calendar, badge and Checkpoint nudge |
| Menu anchors | In the build, these link to the Agenda, Speakers, Checkpoint, Partners and About pages |

SEO is in place: a unique title and description, Open Graph tags and image, and Event structured data (JSON-LD) with dates and USD prices. In Webflow, make `og:image` an absolute URL. Add UTM tags to every campaign link (in-page Checkpoint links already carry `utm_source=site`).

Still to scope (not in this build): VIP-only recordings and any gated area (Webflow no longer has native User Accounts), the form-submission limit on Ike's plan, and a live response count from the Checkpoint.


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
