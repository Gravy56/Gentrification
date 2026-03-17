# Stamford Art Association — Award-Winning Website Redesign

## Goal
Build a website that could be nominated for Awwwards, CSS Design Awards, or FWA Site of the Year 2026. This is for the Stamford Art Association (SAA), a real nonprofit in Stamford, CT. We have full permission to use all their art.

## Tech Stack
- Vanilla HTML/CSS/JS (no framework, keeps it fast and portable)
- Three.js (CDN) for 3D animated backdrop
- GSAP + ScrollTrigger (CDN) for scroll-jacked animations
- No build step required — must open directly in browser

## Design Aesthetic
- Dark, gallery/museum aesthetic (near-black background #0a0a0a or #080808)
- Art takes center stage — images are the heroes
- Typography: elegant serif for headings (Playfair Display or Cormorant Garamond via Google Fonts), clean sans for body
- Accent color: warm gold (#c9a84c) or deep crimson — sparingly, like gallery lighting
- Feels like walking into a world-class contemporary art gallery

## Sections (Single-Page)

### 1. HERO — Full viewport, Three.js animated backdrop
- Three.js canvas fills the entire background
- Animate: floating art-like particles (think ink drops, paint strokes, or abstract geometric shapes slowly drifting)
- OR: a subtle, slowly rotating abstract 3D object made of lines/wireframes
- Large centered headline: "WHERE ART FINDS ITS HOME"
- Subhead: "Stamford Art Association — Making Art Accessible to All"
- Scroll indicator arrow (animated pulse)

### 2. SCROLL-JACKED GALLERY REVEAL
- As user scrolls, artwork images slide/fly in from different directions using GSAP ScrollTrigger
- Pin the section while artworks animate in sequence
- Use the actual art from ./assets/ folder (the JPGs/PNGs of real artwork)
- Show 6-8 artworks with artist names overlaid on hover
- Real works from assets: "Convivo Sin El Calor Del Sol_Remy_Sosa.jpg", "Ego_Chardel_Studio.jpg", "flower-child-lauren-clayton.jpg", "entry_604078_piece_2254550_Rick_Freeman.jpg", "entry_605239_piece_2254616_Nat_Connacher.jpg", "entry_605621_piece_2255947_Yona_Gonen.jpg"

### 3. ABOUT — Parallax text reveal
- "The Stamford Art Association conducts juried shows in our 3-story Townhouse Gallery"
- "Jurors from the Metropolitan Museum, Whitney, MoMA, and Bruce Museum"
- "Founded to make art accessible to everyone in our community"
- Words/lines animate in as you scroll (GSAP split text effect)
- Background: subtle parallax art image

### 4. VENUES — Two-column split
**Townhouse Gallery**
- 8 consecutive shows per year
- 2 solo exhibits + 6 juried shows
- Hours: Friday–Sunday 12–3pm
- Address: Stamford, CT

**Art at the Ferguson**
- One Public Library Plaza, Third Floor Auditorium Gallery
- Stamford, CT 06904

Each card has a hover effect that reveals more info with a smooth animation.

### 5. EVENTS — Horizontal scroll section
Cards that scroll horizontally (scroll-jacked):
- Open Mic Night — Monthly Fridays 6–9pm @ SAA Townhouse (Free, RSVP)
- Art Critique Workshop — Monthly Wednesdays 6pm @ SAA Townhouse (Members)
- Art in the Park — Saturdays 10–12pm, Mill River Park (Free, walk-in)
- Figure Drawing — Saturdays 12–3pm @ UCONN Stamford
- Annual Fundraiser — Follow for announcement

### 6. CURRENT EXHIBITION — Full-width feature
"Black, White & Shades of Gray Show"
- Feb 19 – Mar 19, 2026
- Juror: Sally Harris
- Large atmospheric display
- CTA: "View the Exhibit"

### 7. FOOTER — Minimal, elegant
- SAA logo text
- Social links (Facebook, Instagram)
- Mailing list signup (just a styled input + button, no backend needed)
- Copyright

## Key Technical Requirements

### Three.js Background (Hero)
```javascript
// Floating particle system — subtle, art-like
// 200-400 particles as small geometric shapes
// Slowly drift with subtle mouse parallax
// Colors: very subtle gold/crimson particles on near-black
// OR: animated ink-blot/paint-drip shader effect
```

### GSAP ScrollTrigger — Scroll Jacking
```javascript
// Gallery section: pin for 800vh, trigger each artwork in sequence
// Text reveals: SplitText or manual word-by-word animation
// Horizontal events scroll: pin section, x-translate on scroll
// Numbers/stats: count up when in view
```

### Performance
- Lazy load images
- Use IntersectionObserver for anything not GSAP
- requestAnimationFrame for Three.js loop

## Inspiration References (aesthetics to steal from)
- Bruno Simon's portfolio (three.js immersive)
- Awwwards 2024 winners: dark gallery aesthetics
- Apple product pages (scroll-driven storytelling)
- refokus.com (smooth transitions)

## File Structure
```
saa-website/
  index.html          ← single file, all inline or linked
  style.css           ← main stylesheet
  main.js             ← Three.js + GSAP logic
  assets/             ← already populated with SAA art images
```

## The Standard to Beat
Reference: @mixslides YouTube presentation style — bold, dynamic, high contrast, every element intentional.
This website must feel like the SAA belongs in the same league as MoMA or the Whitney in terms of digital presence, despite being a local nonprofit.

## When Done
Run: openclaw system event --text "SAA website build complete — ready for review in saa-website/" --mode now
