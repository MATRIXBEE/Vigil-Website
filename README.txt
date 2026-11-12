VIGIL Summit 2027 · Existing homepage redesign
v3 · 12 November 2026

OPEN
Open index.html directly, or run a local static server from this folder:
  python -m http.server 5501 --bind 127.0.0.1
Then visit http://localhost:5501/
No install, framework build or package dependencies are required.
Internet access is used for Poppins (Google Fonts) and external destinations.

REGISTRATION
All registration CTAs go to the exact official destination:
https://summit.wearevigil.global/p/register
VIP and Corporate buttons were registration actions in the original implementation
and now use that same official destination, without unapproved query parameters.

FEATURES
- Responsive team-image hero and four-area event/countdown strip
- Mechanical split-flap countdown to 1 March 2027, 14:00 UTC
- Fixed GMT, US Eastern and Gulf rows plus an optional local-time selector
- Google Calendar template link and Apple/Outlook-compatible ICS download
- Larger continuously looping sponsor logos; hover/focus pause; reduced-motion grid
- Five-day timeline with keyboard controls
- Three-question Checkpoint with five archetypes and restart
- Natural-colour rectangular speaker portraits and keyboard/arrow rail controls
- Native FAQ disclosures, scroll reveals and count-up effects
- No public review toggle, yellow approval notes or bracketed placeholders

VERIFY
  node tests/verify.mjs
Runs 31 dependency-free source/logic regression checks.
See VALIDATION.md for actual browser checks and their limits.

HERO ASSET
Uses assets/images/vigil-hero-team.png exactly as supplied, without image editing.
It is a composite reference containing four visible professionals, not a clean
five-person photograph. CSS shows its photographic region and preserves the
four existing faces. A separate five-person photograph is still needed if required.

CONTENT AND SCOPE
NOTES.md retains unresolved client approvals and the historical design record.
Unconfirmed statistics, benefits and personal details were omitted, not invented.
Only this homepage is implemented. Other original page links show a contact
message; their destination pages, legal content and backend services are not built.
The optional quiz email simulation and old registration simulation are removed;
real registration is handled by the official external website.
Calendar saving/import requires the user's calendar application/account.

FILES
index.html          Existing homepage markup, CSS and vanilla JavaScript
assets/             Original branding, speaker and sponsor files; supplied hero
screenshots/        Historical captures plus v3 redesign verification captures
NOTES.md            Implementation decisions and outstanding approvals
VALIDATION.md       Browser results, regression checks and remaining limitations
tests/verify.mjs    Built-in Node regression checks; no npm install required
