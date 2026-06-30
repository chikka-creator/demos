# Role & Goal
You are an Elite Frontend Architect and UI/UX Designer. Your task is to output a single-file web game ("index.html" containing HTML, CSS, and JS). 
CRITICAL REQUIREMENT: The UI MUST be 100% bug-free, perfectly responsive, and absolutely unbreakable on any screen size. ZERO tolerance for overflow, broken layouts, or hidden elements.

# Game Concept: "Co-op Chaos"
- 2-player local co-op on one screen. 
- Duration: 90-second survival.
- Asymmetric tasks: P1 gets text instructing P2 to click a specific image. P2 gets text instructing P1 to click a specific image. Players must communicate verbally.

# UI/UX Style: Modern & Elegant (NO FUTURISTIC VIBES)
- **Aesthetic:** Modern, clean, sleek, and highly polished (Material Design 3 or subtle Glassmorphism). Think of premium, friendly apps—clean white space, soft drop shadows, rounded corners. 
- **CRITICAL:** STRICTLY NO FUTURISTIC, CYBERPUNK, OR SCI-FI ELEMENTS (no neon lights, no glitch effects, no dark terminal aesthetics).
- **Color Palette:** Clean, modern solid colors or soft pastels. For example, a soft Coral/Peach for P1 and a clean Mint/Teal for P2. Backgrounds should be soft and pleasing to the eye.
- **Typography:** Elegant, modern sans-serif (e.g., Inter, Poppins, or system-ui) with clear readability and excellent contrast.
- **Buttons:** Smooth, touch-friendly modern buttons with subtle hover/active states (soft scaling down), rounded corners (`border-radius: 20px`), and soft, realistic drop shadows (`box-shadow: 0 8px 16px rgba(0,0,0,0.08)`).

# THE HEALTH BAR (CRITICAL ELEMENT)
The Health Bar MUST NOT BE HIDDEN OR REMOVED under any circumstances. It is the core visual feedback of the game.
- It must be positioned absolutely in the exact center of the screen, acting as the border/divider between the two players.
- It must have a high `z-index` (e.g., `100`) so it always stays on top of everything.
- It must have a beautiful modern design: a clean track background (e.g., light gray/white with soft shadow) and a vibrant fill color (e.g., modern gradient green transitioning to red as it drops).
- Must have smooth CSS transitions for width/height changes.

# STRICT ZERO-ERROR UI/UX & RESPONSIVE ARCHITECTURE
To prevent ANY mobile UI breakage, you MUST strictly follow these CSS implementation rules:

1. **The Absolute Reset & Viewport:** 
   - `html, body { margin: 0; padding: 0; width: 100vw; height: 100dvh; overflow: hidden; font-family: 'Inter', system-ui, sans-serif; box-sizing: border-box; overscroll-behavior: none; background-color: #f8f9fa; }`
   - CRITICAL: You MUST use `100dvh` (Dynamic Viewport Height) to prevent mobile browser URL bars from breaking the UI.
   - `*, *:before, *:after { box-sizing: inherit; }`

2. **Bulletproof Split-Screen Logic:**
   - The main game container (`#game-container`) must use Flexbox (`display: flex; width: 100%; height: 100%; position: relative;`).
   - **Portrait Mode (Mobile Phones):** 
     - `@media (orientation: portrait) { #game-container { flex-direction: column; } .health-bar-container { width: 90%; height: 24px; top: 50%; left: 50%; transform: translate(-50%, -50%); } }`
     - Top Half (Player 2 zone): `transform: rotate(180deg); flex: 1; display: flex; flex-direction: column; padding: 5vmin; overflow: hidden; justify-content: center; align-items: center;`
     - Bottom Half (Player 1 zone): `flex: 1; display: flex; flex-direction: column; padding: 5vmin; overflow: hidden; justify-content: center; align-items: center;`
   - **Landscape Mode (Laptops/Desktop/Tablets):** 
     - `@media (orientation: landscape) { #game-container { flex-direction: row; } .health-bar-container { width: 24px; height: 90%; top: 50%; left: 50%; transform: translate(-50%, -50%); } }`
     - Left Half (Player 1 zone) & Right Half (Player 2 zone): `transform: none; flex: 1; display: flex; flex-direction: column; padding: 5vmin; overflow: hidden; justify-content: center; align-items: center;`

3. **Fluid Sizing & Anti-Overflow:**
   - NEVER use fixed pixel values (`px`) for major layout elements (except the health bar thickness). Use percentages (`%`), `fr`, `vw`, `vh`, `vmin`.
   - Fonts MUST use `clamp()` to scale perfectly without breaking containers: e.g., `font-size: clamp(1rem, 3.5vmin, 2rem);`.

4. **Action Button Grid:**
   - The grid holding the 4 action buttons must dynamically size itself: `display: grid; grid-template-columns: repeat(2, 1fr); gap: 4vmin; width: 100%; max-width: 45vh; aspect-ratio: 1/1; margin: auto;`
   - Modern Button Styling: `background: #fff; border-radius: 24px; border: none; box-shadow: 0 8px 16px rgba(0,0,0,0.08); touch-action: manipulation; user-select: none; transition: transform 0.1s ease;`

5. **Assets (EXTERNAL IMAGES ONLY, NO EMOJIS):**
   - DO NOT use native emojis. Use high-quality external image URLs (e.g., FontAwesome SVGs CDN, Google Material Icons CDN, or robust public image URLs).
   - Images inside buttons MUST NOT break the button size: `img { width: 50%; height: 50%; object-fit: contain; pointer-events: none; margin: auto; display: block; }`

# Technical & Game Logic Rules
- Build within a single `index.html` file.
- Start Screen, Game Screen, and Game Over Screen must toggle smoothly using CSS.
- Randomize tasks ensuring the requested image is on the OPPOSITE side. Button positions must be randomized each game.
- Shared health bar decreases on a wrong tap or timeout (5 seconds max per task). It increases slightly on a correct tap.
- Win: Survive 90 seconds. Loss: Health hits 0.
- Clean reset logic on "Play Again" (clear all intervals).
