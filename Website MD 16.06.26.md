# Seth Jarrett — Portfolio Site (CLAUDE.md)

Project memory for Claude. Read this first each session, and update it when decisions change.

## What this is
Personal portfolio website for Seth Jarrett, hosted on **GitHub Pages**
(repo: `sethjjarrett-cell.github.io`). Static HTML/CSS/JS, no build step.
Contact: sethjjarrett@gmail.com · linkedin.com/in/seth-jarrett

## Who Seth is (for tone/content)
- 25, First-Class MEng Mechanical & Electrical Engineering, University of Bristol
  (73% avg, specialised in Energy & Renewables).
- Career arc = the site's spine: **University → ~2 years travelling/events/TA work → RED Engineering Design**
  (data centres, London, Sept 2025–June 2026, just under a year) → **Soventix** (solar PV design across Africa, starts July 2026 — written as current).
- Job title used on site: "PV Design Engineer, Soventix" (CONFIRM exact title).
- Writing voice: dry, understated, honest. **British English.**
  Avoid AI tells: no em-dashes as a tic, no "X for the Y" itinerary lists
  ("Washington for the monuments"), no flattery. Keep his jokes.

## Files (all served from repo root; working copies in /home/claude/site)
- `index.html` — homepage. Bio (Soventix-first), career-path timeline,
  three chapter cards ("There's more to it than this") that now **open like books on hover**.
- `engineering.html` — 3 chapters, each its own visual language:
  Ch.01 University = textbook (cream, serif); Ch.02 RED = CAD drawing office
  (blueprint grey, mono, drawing sheets DRG-001..005); Ch.03 Soventix = sun & sand (warm).
  Sticky chapter nav + scrollspy. Request-download modal (Formspree, placeholder endpoint).
- `education.html` — module/grade breakdown, every year sums to 120 credits.
- `life.html` — quiet stone-and-sage. Hobbies (names only), "Occasional entries"
  notebook scaffold, "On the shelf" reading list (hidden until content.json filled).
- `travel.html` — D3 world map (exact visited-country ISO lists), region postcards.
- `north-america.html` — NY/Washington/Miami journal. Editorial/magazine skin.
- `asia.html` — 9-country journal. Scrapbook skin (taped scraps, polaroids).
  Per-country palettes kept as info; daylight overrides so no light→dark cliffs.
- `style.css` — shared. Holds the daylight Miami + Thailand palette overrides
  and chapter-transition styles. **MUST deploy alongside the HTML or pages render broken.**
- `content.json` — runtime text/photo overrides + Cloudinary gallery URLs.

## Key design decisions (don't silently reverse)
- **Deploy all changed files together**, especially style.css (cross-dependencies).
- **NDA on RED work**: show method/skills, withhold client/site/specifics.
  Regions broadened (Middle East→EMEA). DRG-003 busbar calc note is generic +
  carries an explicit "numbers illustrative, real params under NDA" note.
  Have RED line manager glance at it before fully public.
- **Grades**: IRP (wind mini-grid) = 83% everywhere. Group Industrial Project = 65%/2:1
  (NOT First Class — don't claim it).
- **Chapter transitions** (engineering.html): gradient blend bands between all 3 chapters.
  01→02 grid lines align (band uses 24px grid, height 240px); the Soventix sun is a full
  360° circle rising through the 02→03 boundary. Header→Ch01 seam softened (grid fades to cream).
- **Figures are inline SVG** in the page's own palette (not image files) — crisp, themed,
  no asset management. Built from the real report numbers via Python.
- **Koh Rong passage** (asia.html) is Seth's best writing — keep it. "ruined my life" → "ruined my life slightly".
- **Methanol-incident hostel** (asia Laos) NOT named — "a hostel we had been to ourselves" (legal safety).
- **Phone number removed** from all contact info.
- Map needs internet for world-data; has a fallback.

## Engineering worked examples (the two on the University chapter)
1. **§1.1 Wind data without the wind** — anemometer campaign failed (wind below 0.7 m/s
   threshold), pivoted to wind-shear power law V=V₁₀(H/10)^(1/α), α=4 → 12% reduction at 6 m.
   Two SVG figs: (a) Weibull mean-shift 4.5→3.96 m/s with mean lines;
   (b) terrain profiles (α=7 open, 4 farm, 2.5 obstructed) all sharing V_ref=4.5 at 10 m,
   turbine interpolation marked at 6 m → 3.96 m/s. Legend in bottom-right clear zone.
   A-level results subsection ("Before Bristol", Rednock Sixth Form: Maths A*, Physics A*,
   Chemistry A) sits at the end of the University chapter — facts only, no narrative.
2. **§1.2 Battery: capacity & depth of discharge** — reframed away from heavy optimisation maths.
   Two SVG figs recreated from the GIP datasheet: (a) capacity vs temperature (site 28°C → 100.2%,
   a bonus not a penalty); (b) lifetime energy vs DOD using E_lifetime=(DOD+f(T))·N·E_rated/100,
   peaks ~53% but design chose 80% (capex trade). Discussion-led, not derivation-led.
   Both §1.2 figs recreated from Claude_GIP_Batery_context_pages.pdf.

## Source reports (Seth's uploads — keep handy)
- `Wind_Pump_Conversion_Project_Minigrid_Final_Draft.pdf` — solo IRP, 83%, Christmas tree
  farm near Bristol. Mean wind 4.5 m/s, α=4, 12% shear reduction.
- `Group_Industrial_Project_FINAL.pdf` — Brazilian Amazon solar DC microgrid (team of 4).
  Seth's section = battery. 28°C → 100.2% capacity; 53% optimal DOD, 80% chosen, 25.3 MWh.

## Open TODOs / to confirm
- Confirm Soventix exact job title.
- Confirm milestone peak name + "Athens Marathon" (EDIT comments in life.html).
- Set trip dates via data-when on north-america.html and asia.html.
- Configure Formspree FORM_ENDPOINT + FALLBACK_EMAIL in engineering.html.
- Write first notebook entry + first book for life.html.
- Drafts pending (asia.html): Malaysia, Singapore, Philippines, Indonesia.
- Add Cloudinary photo URLs + a caption per image to content.json galleries.

## Deploy
git add <files> && commit && push  — OR GitHub web "Add file → Upload files" (same name overwrites).
Wait 1–2 min for rebuild; hard-refresh (Ctrl+Shift+R) for CSS cache. Always include style.css.
