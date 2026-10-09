# Wishora V12 — Template-Specific Customizer

Static HTML/CSS/JS build. No React, Vite, npm or build step is required.

## Launch

1. Extract this folder.
2. Double-click `START-WISHORA.bat` for a local server, or open `index.html` directly.

## Main product flow

Choose occasion → choose one of 20 templates → customize the fields that template actually uses → optional compatible page changes → choose media used by that template → style → privacy/passcode → preview → generate share link.

## V12 fixes

- Content, Experience, Style, Media and Privacy are isolated panels. Controls are rendered dynamically by the selected template.
- Media tab shows only media types actually used by the selected template.
- Birthday Classic shows birthday-specific interaction controls; Birthday Gift does not.
- Experience tab shows the selected template's page sequence and only compatible optional pages.
- Template photo limits are respected; current Birthday templates are limited to 4 photos.
- Preview loads the actual `gift.html` runtime with the selected template and uses Desktop/Tablet/Mobile fit modes.
- Preview no longer embeds a second `srcdoc` copy of the runtime, reducing local-file/script-loading issues.
- 10 occasions, 2 templates each = 20 templates total.

## V12.1 – live preview fixes

- Preview now actually refreshes when you edit (iframe URL gets a cache-busting query; changing only the `#hash` never reloaded it). Updates are debounced (300 ms).
- `gift.html` body class renamed `gift-body` → `gift-view` (it collided with the gift-box illustration rule and collapsed the whole page to a 118px strip).
- Birthday Classic host now has a real height, so its inner iframe no longer collapses to 150px.
- Template background/motif art uses absolute URLs (relative `url()` in CSS variables resolved against `css/` and 404'd).
- `builder.html` no longer loads `gift.js` / birthday scripts (they threw an error on the builder page).
- Preview scaling is width-based (no more drift), the preview panel is sticky, and Desktop mode is 1280×800.
- Added missing favicons (removes the favicon 404).

- V13: new `css/template-v13.css` visual layer – per-occasion color palettes, centered glass-card scenes, larger glowing hero art, serif typography, gradient buttons, mobile tuning.

- V14: Classic-Confetti-style experience for every occasion (`css/occasion-experience.css`, `js/occasion-experience.js`): playful Yes/No intro question, floating occasion emojis, confetti bursts on taps, tap-to-open envelope letter, light sticker-style cards, bouncing hero art, compact intro.

- V15: Classic-Confetti-style flow per occasion (`js/occasion-flows.js`, `css/occasion-flow.css`). After the intro each occasion plays: tap-to-reveal words > light candles/diyas/lamps > pick cards > photo wall > envelope letter > open the gift > wishes > finale. Builder content fields are generated per occasion (data keys `f_pop1..3`, `f_light`, `f_pick1..3`, `f_gift`, `f_wish1..3`, `f_end`, plus `letter`, `recipient`, `sender`, `title`, `date`). Birthday Classic is unchanged.

- V15.1: flow now advances like Classic – game steps (words, light-up) auto-advance after completion; reading steps use labelled text buttons ("Keep going →", "Show me the ending →"); no arrow buttons.

- V15.2: occasion flows now mirror Classic Confetti: 11 pages (intro + 10), Back button on every page, glossy pop-the-balloons page (4 words), photo carousel with Prev/Next, soundtrack page (songTitle/songArtist + audio/video from Media tab), "one more surprise" page, two-tap gift, final screen. New builder fields: `f_pop4`, `songTitle`, `songArtist`, `f_surprise`.

- V16: every template has its own design skin (`js/occasion-skins.js`, `css/occasion-skins.css`): own font pair, background pattern, card style, pop-item shape, photo style, layout alignment, button style, page transition and page order. Signature pages: trailer (Anniversary Cinema), timeline (Our Love Story, Next Chapter, Memory Lane, Festive Family), stamp (Bon Voyage), rooms (House Tour), quiz (Guess the Baby), vows (Wedding Vows). Builder fields are generated from each template's own page list. Fonts load from Google Fonts (non-blocking, with fallbacks).

- V16.1: template-skinned intro page (Yes/No) inside the flow, per-template page titles, scattered pop field, finale with Copy link. Passcode-protected pages still use the standard intro + gate first.

- V17: unique atmosphere per template (`js/occasion-vibes.js`, `css/occasion-vibes.css`): living background layer (balloons, petals, fireflies, film grain, aurora, embers, plane, blueprint, mandala, etc.), kinetic title animation (type, bounce, glitch, hand, glow, mask...), page-change effect (curtain, wipe, iris, flash) and an intro tagline. Respects prefers-reduced-motion.

- V18: builder no longer asks for recipient/sender/finale title/date on flow templates; video option removed; audio is background music (`js/bgm.js`: starts on first tap, loops, mute button) and the soundtrack page is gone; "Our Love Story" (`wishora-anniversary-story`) is the 14-step Extended Love Journey (`js/love-journey.js`, `css/love-journey.css`).

- V19: heavy VFX for "Our Love Story" (`js/lj-vfx.js`): canvas particle engine (glass-shard heart break with slow-mo, arrow spark trail, shockwaves, lens flares, smoke, bokeh, god rays, starfield + shooting stars, fireworks, confetti cannons, heart fountains), 3D photo tilt, focus-pull page transitions, film grain + vignette, adaptive quality, reduced-motion support.

- V19.1: Our Love Story now takes 8 photos (1–4 Memories/collage, 5–8 behind the four Choose-a-Memory hearts), labelled in the Media tab; builder page-count badge shows the real flow length.

- V19.2: "Generate share link" no longer demands a recipient name or page title on the flow templates (those fields were removed from their builders). Passcode check unchanged.

- V19.3 (Classic Confetti Birthday bug-fix pass): screens now scroll (nothing can be pushed off-screen); Back button no longer overlaps titles; compact layouts for landscape phones and short windows (`css/birthday-fixes.css`); photo captions show title · date + note; 4 memory slots (matches 4 photos); new builder fields for bouquet messages and wishes; surprise page uses the Surprise message; Special date shown on the final page; dead fields removed (Quiz question); soundtrack page is audio-only.

- V20: heavy VFX for Classic Confetti Birthday (`js/bd-vfx.js`, `css/birthday-vfx.css`, engine `js/lj-vfx.js`): rubber-fragment balloon pops, candle glow + smoke, confetti cannons + streamers, fireworks, petal rain, glitter + bokeh, 3D photo tilt, golden light bursts. Engine optimized (cached sprites + rays, half-res 30fps background, load-shedding governor, JS cost ~0.1-1.3 ms/frame).

## Static-share note

The current static build embeds customized media into the self-contained link. For production hosting, move published content/media and passcode verification to a server so links remain short and private.
