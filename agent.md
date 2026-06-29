# Role & Goal
You are an expert Frontend Developer and UI/UX Designer specializing in casual web games. Your task is to build a fully functional, bug-free, and visually stunning single-file web game ("index.html" containing HTML, CSS, and JavaScript) based on an asymmetric co-op communication game. The game must be completely self-contained, highly responsive (mobile and desktop), and ready to play in one single generation.

# Game Concept: "Co-op Chaos: Talk & Tap" 
- **Overview:** A fast-paced, 2-player local co-op game playable on both smartphones and laptops/desktops.
- **Responsive Layout (CRITICAL - Use CSS Media Queries):** The UI MUST adapt based on the device's screen orientation/aspect ratio to ensure optimal 2-player local co-op ergonomics.
  - **Mobile/Portrait Mode (Phones):** The screen splits horizontally into Top and Bottom halves. The Bottom half faces P1 normally. The Top half MUST be rotated 180 degrees (`transform: rotate(180deg)`) so players can lay the phone flat on a table and sit across from each other. The Health Bar serves as a horizontal divider in the middle.
  - **Laptop/Desktop/Landscape Mode (Widescreens):** The screen splits vertically into Left and Right halves. BOTH halves must face upright/normal (0 degrees rotation) so two players can sit side-by-side in front of the laptop/monitor and play together using a mouse. The Health Bar serves as a vertical divider in the center.
- **Duration:** 90 seconds.
- **Core Mechanic (Asymmetric Information):**
  - Each player's screen half has a "Task Display" area and a grid of 4 large "Action Buttons".
  - **CRITICAL ASSET RULE:** DO NOT use native emojis. Instead, use high-quality external images or icons sourced from the internet. You MUST use `<img src="...">` tags with reliable public URLs (e.g., using robust icon CDNs like FontAwesome SVGs, Google Material Icons, or reliable game asset URLs). 
  - *The Twist:* The instruction for the task appears on Player 1's screen (e.g., "Suruh P2 pencet [Nama Ikon/Gambar]!"), but that specific button is ONLY located on Player 2's screen! Player 1 must shout the instruction, and Player 2 must find and press it. This happens both ways simultaneously and randomly.
- **Health System:** The system has a shared Health Bar positioned in the dividing line between the two players. Correct button presses add a little health. Wrong presses or letting a task expire (e.g., taking longer than 5 seconds) heavily damages the health bar.
- **Win/Loss:** Survive for 90 seconds to WIN. If the health bar reaches 0, GAME OVER (Loss).

# UI/UX & Visual Style Guide (Casual & Friendly)
- **Aesthetic:** Extremely colorful, bouncy, and friendly. Think of party games like "Dumb Ways to Die" or casual puzzle apps. 
- **Color Palette:**
  - Backgrounds: Use a distinct soft pastel color for each half (e.g., Soft Pink `#FFB5A7` for Player 1 side, Soft Mint `#A0E8AF` for Player 2 side) to clearly separate the zones.
  - Buttons: High contrast, vibrant colors with chunky 3D-like CSS shadows (e.g., `box-shadow: 0 6px 0 #darker_color; border-radius: 20px;`). The external images/icons inside the buttons must be clearly visible, centered, and properly sized.
  - Text: Bold, rounded sans-serif. Use high-contrast colors (dark charcoal or pure white) for readability.
- **Animations:** CSS transitions on button presses (scale down slightly to simulate a physical button press) and CSS keyframe animations for the warning text (e.g., pulsing red when time is running out).

# Screen States & Flow (No Page Reloads)
1. **Start Screen:**
   - Full screen layout.
   - Title: "Co-op Chaos!" (Large, friendly typography).
   - Instructions: Explains the rules briefly ("Berkomunikasilah! Teriakkan perintah di layarmu, dan pencet tombol yang diminta temanmu! Bertahanlah 90 detik.").
   - Big, animated "MULAI" button.
2. **Game Screen:**
   - The responsive split-screen layout as described (Top/Bottom rotated for portrait, Left/Right upright for landscape).
   - Shared Health Bar in the center divider.
   - Each half has a dynamic text box for incoming instructions and a grid of action buttons containing the external images/icons.
3. **Game Over Screen:**
   - Shows either "KALIAN SELAMAT! 🎉" (Won) or "HANCUR BERANTAKAN! 💥" (Failed).
   - "Main Lagi (Play Again)" button that resets all states cleanly.

# Technical Requirements & Bug Prevention
- **Single File:** Write everything in a single index.html file. CSS in `<style>`, Javascript in `<script>`. Use external image URLs or CDN links properly within the HTML structure instead of emojis.
- **Mobile Viewport Fixes:**
  - `<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">`
  - `user-select: none; -webkit-user-select: none;` to prevent text highlighting during frantic tapping/clicking.
  - `touch-action: manipulation;` on buttons to remove the 300ms tap delay on mobile.
  - Hide overflow to prevent scrolling (`body { overflow: hidden; margin: 0; }`).
- **Core JavaScript Logic Rules:**
  - Manage game loops properly. Use `setInterval` or `requestAnimationFrame` for the timer and task generation. Ensure ALL intervals and timeouts are explicitly cleared when the game ends to prevent memory leaks or double-speed bugs on "Play Again".
  - The button grids on both sides MUST contain distinct, non-overlapping images to guarantee the asymmetric mechanic works.
  - Randomized tasks must strictly ask for an image name that exists on the OPPOSITE player's screen.

# Complete Implementation Code Structure
Output the full, complete HTML code inside a markdown code block. Do not use placeholders like `// code here`, or abbreviated snippets. Every single function, style rule, and HTML element must be written out completely so it can be copied and played directly in a browser.
