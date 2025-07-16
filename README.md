Path of Heroes – Master README (v37.26)
Last Updated: July 15, 2025
GitHub Repository: [https://github.com/thewahish/path-of-heroes-rpg](https://github.com/thewahish/path-of-heroes-rpg)
Current Status: In progress (~75% complete). The game engine loads with console warnings handled via safe listeners (e.g., missing IDs warn but don't crash). Debugger is active with real-time state and console capture. Battle screen UI and functionality are under active refactor. Inventory is functional (equip/use/sort/sell). Character selection updated to v3 layout. Priorities: Complete battle UI refactor, implement random events loop, integrate shrines/shops/campfire. All code adheres to overrides (10-floor demo, random events, no map).
📘 Project Purpose & Master Record
This document serves as the authoritative Master Game Guide / Project Bible for Path of Heroes. It consolidates all design decisions, feature breakdowns, development notes, and critical updates. All changes must be logged here via versioned commits to maintain continuity. It acts as a comprehensive master game plan for backups and resuming work. The README.md file must always include all changes and original file excerpts (e.g., code snippets for context) to ensure portability across AI sessions or human collaborators. New features or versions must append changes to the changelog without overwriting existing content, ensuring project tracking across sessions.
📂 Contents

Game Overview
UI/UX Design Principles & Rules
UI & Screen Design Blueprints
Global HUD & UI Behavior
Core Gameplay Loop
Debugger System
Playable Characters
Combat System
Inventory, Loot & Potions
Architecture & File Structure
Technical Overview
Design Recovery & Progress Tracking
Development & Version Control
Log of Major Historical Updates
Track Changes (from v37.25 to v37.26)
Jump Code Index

🎮 Game Overview
Title: Path of Heroes / طريق الأبطالGenre: 2D top-down, turn-based roguelike dungeon crawler (inspired by Hades, Dead Cells, Slay the Spire, Diablo).Platform: Mobile-only web game (HTML/CSS/JS-based). **No <canvas> elements are to be used.** PWA-ready for Android/iOS.Orientation: Strictly portrait mode on all screens (fits tablets with centered content; no black bars unless necessary and without offsetting the design).Technology: Multi-file, component-based structure with index.html as the entry point; modular JS/CSS in subfolders; screen HTML loaded dynamically in screens/; mockups in designs/ for testing without breaking the main codebase.Languages: Fully bilingual (English/Arabic) with dynamic RTL switching for in-game text. Documentation is English-only.Visual Style: Dark fantasy with Arabic/English fusion, high contrast, low saturation, glowing effects for rare items.Input: Touch-only with on-screen buttons and gestures.Scope: The demo covers 10 floors in the "Ancient Ruins" biome with one boss. The full game spans 60 levels across 6 biomes:



Floors
Biome
Enemies
Boss



1–10
Ancient Ruins
Skeletons, Slimes
Lich King


11–20
Sand
(Planned)
(Planned)


21–30
Fire
(Planned)
(Planned)


31–40
Ice
(Planned)
(Planned)


41–50
Water
(Planned)
(Planned)


51–60
Wind
(Planned)
(Planned)


Level Cap: 10 for the demo, 60 for the full game.
🎨 UI/UX Design Principles & Rules
Golden Rules

Portrait-Only: All screens are designed exclusively for portrait orientation. No landscape support.
Static Layouts: UI elements (containers, boxes, buttons, text) must have fixed dimensions to accommodate the longest text strings in English and Arabic, with centered text to handle varying lengths. This ensures consistent UI across languages.
No Scrolling: UI layouts must fit within a standard mobile viewport without vertical scrolling.  
Note: The shop.html design includes a scrollable item grid (overflow-y: auto). This must be reviewed and potentially refactored into a paginated view.


Safe Zones: Interactive UI elements must be within 80-95% of the screen area for accessibility and to prevent accidental taps.
No Redundant Globals: Global controls (e.g., language toggle) are part of the main game shell and must not be re-implemented in individual screen files.
Mobile-First Sizing: max-width: 480px.

Dark RPG Palette

Background: radial-gradient(ellipse at center, #1a0f0a 0%, #0d0604 40%, #000000 100%)
Primary: #d4a656
Secondary: #5c4423
Text: #f8e4c0
Health: linear-gradient(90deg, #8b0000, #ff4500, #ff6347)
Mana: linear-gradient(90deg, #191970, #4169e1, #87ceeb)

Rarity Colors

Common: Gray (#95a5a6)
Uncommon: Green (#27ae60)
Rare: Blue (#3498db)
Epic: Purple (#9b59b6)
Mythic: Orange (#e67e22)
Legendary: Gold (#f1c40f)

🖥️ UI & Screen Design Blueprints
This section serves as the official registry for all UI design files, stored in screens/ for production or designs/ for mockups. Only the Intro and Character Selection screens are confirmed to be fully working (design and functionality). Other screens marked as "✅ Design Complete" refer to completed visual blueprints, not implemented functionality.



Screen/Feature
Design File
Status
Key Functionality



Intro
screens/intro.html
✅ Working (Design & Functionality)
Initial game entry point with Main Menu.


Character Selection
screens/character-select.html
✅ Working (Design & Functionality)
Select hero via tabs, view stats, start a new run.


Battle Screen
screens/battle.html
✅ Design Complete
Engage in turn-based combat, use skills and items.


Shop / Merchant
screens/shop.html
✅ Design Complete
View gold, browse items for sale, buy items.


Shrine
screens/shrine.html
✅ Design Complete
Choose one of three powerful blessings.


Campfire
screens/campfire.html
✅ Design Complete
Heal, open inventory, or save; proceed to next event.


Game Over
screens/game-over.html
✅ Design Complete
View run stats, retry from checkpoint, or return to menu.


Dynamic UI Element Updates
The game dynamically updates UI elements (e.g., HP/resource bars, stat displays) using:

game.js:setScreen(screenId): Loads screen HTML/CSS/JS and manages visibility.
js/screens/battle.js:updateBattleUI(): Refreshes player and enemy panels during combat (placeholder, to be implemented).
game.js:updateBar(barId, current, max): Updates visual fill percentage of progress bars (e.g., HP, Mana).
game.js:updateElement(id, value): Updates text content of specific HTML elements by ID.

🌍 Global HUD & UI Behavior

Global Elements: The top bar (Floor Number, Gold Count, Inventory button) is managed by game.js:setScreen.
Visibility Rule: Global elements appear only after Character Selection (e.g., in encounters, shops) and are hidden on Main Menu and Character Selection screens.
Language Toggle: A fixed-position global component, not part of any screen's content area.
Inventory Button Behavior:
Toggles expand/minimize on tap.
In Battle: Inventory can be viewed but equipping/using items (including weapon swapping) is disabled. Closing returns to the active battle.
Outside Battle: Closing returns to the previous screen (e.g., Main Menu if no active event).



🔄 Core Gameplay Loop
The player's journey is a floor-by-floor dungeon descent, designed to be challenging and grindy, requiring multiple deaths to gather resources (gear, potions, HP, resources) to defeat enemies. The biome boss (e.g., Lich King on Floor 10) is highly difficult.

Start: Begin at Main Menu, proceed to Character Selection, and start the run.
Progression: After Character Selection, enter the dungeon with floors driven by random events.
Encounters: Each floor presents randomized events (e.g., Shrine then Battle, Shop then Battle). Fleeing a battle may lead to a Campfire.
Battle: Turn-based combat against enemies.
Shop: Spend gold on items from a merchant.
Shrine: Choose one of three powerful blessings.
Campfire: Rest & Heal, manage inventory, or proceed to the next random event/floor (strategic decision point).
Boss: Face a unique, powerful enemy at the biome's end (Floor 10 for demo).
Rewards: Gain XP, Gold, and Items after clearing events.
Save/Load & Options: Not implemented in the demo for faster MVP release.
Checkpoints: Autosave every 5 floors (Floors 1, 5 for demo), preserving XP, level, and equipped gear.
Death & Encouragement: On HP=0, the Game Over screen shows run stats (Floor Reached, XP Earned, Gold Lost) with options to "Retry from Checkpoint" or return to "Main Menu." Players lose 90% of gold and all unequipped items, respawning at the nearest checkpoint (Floors 1, 5, 10, etc.). One of 20 bilingual encouragement messages is displayed.
Demo Completion: After defeating the Floor 10 boss, a modal displays: “You have beaten the demo! Please purchase the full game at [https://pathofheroes.com/buy](https://pathofheroes.com/buy).”

🐛 Debugger System

Toggle: Activated via a 🐛 icon at the bottom-left.
Functionality: Displays real-time game state and logs.
Activation: Enabled only when DEBUG_MODE = true.
Code Files: Primarily js/debug.js, activated by js/main.js.
Debug Panel: Implemented in index.html with a header, game state section (debug-content), console log section (debug-log-content), and buttons for copying logs (debug-copy-btn) and closing (debug-close-btn).

Advanced Features (v36.6)

Overhauled into a standalone tool.
Implements window.onerror and unhandledrejection handlers for runtime exceptions and promise rejections with stack traces.
Rewrites console interception to format objects/arrays as interactive, collapsible trees.
Includes a "Copy All Logs" button for one-click bug reporting.
Updated debug panel UI in index.html.

🧙 Playable Characters



Class
Name
Resource
Role
Specialization



Warrior
Taha / طه
🟣 Vigor
Tank / Melee
🛡️ High DEF, ❤️ High HP


Sorceress
Mais / ميس
🔵 Mana
Ranged Mage
🔮 AoE, ❄️ Crowd Control


Rogue
Ibrahim / إبراهيم
🟢 Energy
Assassin
⚡ High SPD, 💥 High Crit



Level Cap: 10 for the demo, 60 for the full game.
Ability Unlocks: At Levels 1, 5, 10, 15.
Stats: HP, ATK, DEF, SPD, Crit.

⚔️ Combat System

Turn-based: Initiative based on SPD stat.
Actions: Attack, Skill, Defend, Flee.
Critical Hits: 10–20% crit chance.
Status Effects (Planned): Poison, Burn, Freeze, Stun, Shield, Regen.
Elemental Wheel (Planned): Fire > Ice > Nature > Shadow > Fire.
UI: Dynamically loaded by js/screens/battle.js, screens/battle.html, and css/battle.css.
Dynamic Difficulty & Rewards Scaling: Enemy stats (HP, Attack, Defense, Speed) and rewards (XP, Gold) scale with floor number using GameConfig.DIFFICULTIES multipliers.

🎒 Inventory, Loot & Potions

Slots: Head, Shoulders, Chest, Legs, Feet, Hands, Weapon, Accessory.
Item Naming Convention: [Prefix] [Base Item Name] [Suffix/Affix]. Higher rarity items use special prefixes/affixes (e.g., "of the Wolf").
Loot Drop Rules:
Enemies: Guaranteed loot drop (gear, potions, or gold). Rarity: Common (50%), Rare (15%), Legendary (0.2%), adjustable for balance.
Bosses: Drop higher-quality loot.
Item Formula: (ATK + DEF + bonus) × multiplier + affinity.


Potions & Consumables:
Types: HP Potion (restores health), Resource Potion (Elixir, restores Vigor/Mana/Energy), Antidote (cures status effects).
Acquisition: Found as loot, purchased at Shops, or awarded at Shrines.
Usage: Consuming an item in combat counts as a turn.
Item Level: Displayed on hover.



⚙️ Architecture & File Structure
The file structure reflects the modular, component-based design. Root files (except index.html) and non-core CSS/JS files may change names/locations without updating this guide, provided modularity and functionality are maintained.
path-of-heroes-rpg/
├── .gitignore
├── index.html
├── README.md
├── archive/
│   ├── Path of Heroes - Master README (v32.3).md
│   ├── Path of Heroes - Master README (v32.4).html
│   ├── README31.md
│   ├── readme32.5.md
│   ├── version_control.md
├── assets/
│   ├── audio/
│   ├── images/
│   ├── videos/
├── css/
│   ├── main.css
│   ├── intro.css
│   ├── character-select.css
│   ├── battle.css
│   ├── shop.css
│   ├── shrine.css
│   ├── campfire.css
│   ├── game-over.css
│   ├── inventory.css
├── js/
│   ├── main.js
│   ├── debug.js
│   ├── screens/
│   │   ├── intro.js
│   │   ├── character-select.js
│   │   ├── battle.js
│   │   ├── shop.js
│   │   ├── shrine.js
│   │   ├── campfire.js
│   │   ├── game-over.js
│   ├── core/
│   │   ├── config.js
│   │   ├── game.js
│   │   ├── localization.js
│   │   ├── state.js
│   ├── systems/
│   │   ├── combat.js
│   │   ├── inventory.js
├── screens/
│   ├── intro.html
│   ├── character-select.html
│   ├── battle.html
│   ├── shop.html
│   ├── shrine.html
│   ├── campfire.html
│   ├── game-over.html
├── designs/
│   ├── campfire.html
│   ├── designs.html
│   ├── gameoverdesign.html
│   ├── newcharacters.html
│   ├── shop.html
│   ├── shrine.html
│   ├── temp.html
│   ├── victory.html

⚙️ Technical Overview
The PathOfHeroes class orchestrates the game, managing state, screen transitions, and system interactions.

Initialization (init()): Entry point; initializes core systems (localization, state, combat, inventory), sets up event listeners, and starts the loading sequence. Critical errors alert and halt the game.
System Initialization (initializeSystems()): Instantiates Localization, GameState, CombatSystem, and InventorySystem.
Event Listeners (setupEventListeners()): Binds global listeners for debugging, game controls, and debug panel clicks.
Loading Sequence (startLoadingSequence()): Displays a progress bar before transitioning to the Main Menu.
Method Binding (bindMethods()): Ensures this context for event listeners/callbacks.

Core Systems

Localization: Handles dynamic English/Arabic text switching.
GameState: Tracks active screen, player data, floor, gold, inventory, and battle status.
CombatSystem: Manages turn-based combat logic.
InventorySystem: Handles adding, equipping, using, sorting, and selling items.

📝 Design Recovery & Progress Tracking
Issue: The Battle Screen UI implementation has faced significant issues, resulting in lost progress and no working prior version.
Strategy for Recovery

Re-conceptualize/Re-design: Revisit screens/battle.html if it proves too complex or flawed.
Mockups First: Create and test standalone HTML mockups (with dummy logs) in designs/ before integrating into screens/.
Simulate Execution: Internally simulate browser execution and debug mockups before integration.
Incremental Commits: Break UI implementations into small, descriptive commits with Jump Codes.
Versioned Backups: Maintain versioned mockups with 'stable' checkpoints for key screens.
Communication: Flag implementation challenges or deviations for collaborative resolution.

🛠️ Development & Version Control
Rules for Developers

Use standalone HTML mockups (with dummy logs) in designs/ for new screens or major UI changes.
Simulate browser execution and debug before integration.
Add Jump Code headers (e.g., // game.js, jump-V.36.6-1) above code blocks in markdown responses, not in actual code files.
Append updates to the changelog, never overwrite README.md sections.
For new/changed HTML, focus on formatting, not programming logic.
Git Branch Management: Use main or master as the primary branch (verify with git branch -r). Sync local branches with git pull or git push to avoid conflicts.

Commit Message Format

Title: Version: V.X.X.X - type(scope): subject (e.g., feat(ui), fix(battle), docs(readme)).
Body: Brief paragraph explaining the change and its purpose.
Example:Version: V.37.1 - fix(ui): Correct battle screen layout

Refactored player stats panel to a single-column layout for better readability. Added padding to resolve overlap with the language selector.



✅ Log of Major Historical Updates

v30–v31: Initial setup, scope definition, core mechanics established.
v32: Overhauled UI/UX with new screen designs (Character Selection, Dungeon Map, Shop, Shrine, Campfire, Game Over).
v32.1: Added formal Version Control and AI Collaboration rules.
v32.2: Introduced UI & Screen Design Blueprints table.
v32.3: Moved mockups to designs/ folder; updated guide paths.
v32.4: Added "Static Layouts" rule for consistent UI across languages.
v32.5: Finalized battle screen design; set global UI rules (Floor/Gold/Inventory); clarified loot/potion systems.
v32.6–v32.8: Implemented Global HUD, refactored Character Selection and Battle screens, added guaranteed loot drops.
v32.9: Consolidated project info into README.md as the single source of truth.
v36.5 – July 13, 2025:
Updated death penalty to respawn at checkpoints (Floors 1, 5, 10, etc.).
Renamed project folder to path-of-heroes-rpg/.
Mandated appending updates to README.md with code excerpts.
Reworded documentation for AI compatibility.


v36.6 – July 13, 2025:
feat(dev): Overhauled debugger into a standalone tool with window.onerror, unhandledrejection handlers, console interception, and "Copy All Logs" button.
docs(readme): Added Jump Code Index for versioned code tracking.


v36.9 – July 14, 2025:
docs(readme): Added Technical Overview, expanded Game Overview with 6-biome structure, refined Gameplay Loop, added Dynamic UI Updates and Difficulty Scaling, clarified inventory restrictions, removed Konami Code references.


v37.0 – July 14, 2025:
docs(readme): Corrected Italian to English in documentation; introduced screens/ folder with screen-specific HTML/CSS/JS; retained designs/ for legacy mockups.


v37.1 – July 15, 2025:
docs(readme): Clarified Battle screen refactor, added js/screens/ for screen-specific JS, updated Game Overview for component-based structure, added dynamic UI functions, and Combat System UI details.


v37.3 – July 15, 2025:
docs(readme): Clarified English-only documentation, reformatted file tree, added Debug Panel details, and Git Branch Management rule.


v37.4 – July 15, 2025:
docs(readme): Added archive/ and assets/ folders, listed all screen-specific files, removed test.txt, noted designs/dungeonprogress.html and designs/proof.html for review.


v37.6 – July 15, 2025:
docs(readme): Removed obsolete designs/ files (battle.png, battlescreen.html, split_code.bat, dungeonprogress.html, proof.html) and updated file structure.


v37.7 – July 15, 2025:
docs(readme): Initial implementation of foundational game structure, intro screen, and debugger.


v37.8 – July 15, 2025:
docs(readme): Prevented instantiation of unimplemented systems in `js/core/game.js`.


v37.9 – July 15, 2025:
docs(readme): Resynced core files to resolve module export error.


v37.10 – July 15, 2025:
docs(readme): Re-delivered foundational game files.


v37.11 – July 15, 2025:
docs(readme): Updated Code Generation Protocol to use standard Markdown code blocks as a temporary workaround for copy issues.


v37.12 – July 15, 2025:
docs(readme): Permanently changed code delivery format to standard Markdown code blocks.


v37.13 – July 15, 2025:
docs(readme): Implement Character Selection screen.


v37.14 – July 15, 2025:
docs(readme): Character select screen layout & image 404s.


v37.15 – July 15, 2025:
docs(readme): Character Select screen layout, localization & button visibility.


v37.16 – July 15, 2025:
docs(readme): Language toggle icon & Character Select layout fix.


v37.17 – July 15, 2025:
docs(readme): Integrate "Courtyard of Fate" structure with PoH aesthetics.


v37.18 – July 15, 2025:
docs(readme): Provide standalone character selection test HTML.


v37.19 – July 15, 2025:
docs(readme): Complete re-delivery of core and character select files.


v37.20 – July 15, 2025:
docs(readme): Provide standalone character selection test HTML.


v37.21 – July 15, 2025:
docs(readme): Integrate blended design into modular structure.


v37.22 – July 15, 2025:
docs(readme): Global icon positioning, layout truncation & localization.


v37.23 – July 15, 2025:
docs(readme): Font Awesome icons & character select truncation.


v37.24 – July 15, 2025:
docs(readme): Update Font Awesome CDN to stable version.


v37.25 – July 15, 2025:
docs(readme): Documented severe code truncation limitation and its implications.

🔄 Track Changes (from v37.25 to v37.26)

Version Number Update: Updated from v37.25 to v37.26.
Platform/Tech Stack:
Previous: "Platform: Mobile-only web game (HTML/CSS/JS), PWA-ready for Android/iOS."
Change: "Platform: Mobile-only web game (HTML/CSS/JS-based). **No <canvas> elements are to be used.** PWA-ready for Android/iOS."
Reason: Explicit user directive to prohibit the use of <canvas> elements in game development.

Code Generation & Debugging Protocol:
Previous: "Output Format: Due to a severe and persistent technical limitation in the AI's code generation output, large code blocks (especially those with complex inline data like SVG paths, or lengthy JavaScript/CSS files) may be truncated. This results in incomplete and broken code. As a workaround: (1) Complex inline SVGs for icons will be removed and replaced with very simple, fundamental shapes or text placeholders, or the user will need to manually integrate external Font Awesome SVGs. (2) Users are advised that generated code may be incomplete, and if truncation occurs, they may need to request smaller, segmented code blocks or communicate the exact missing parts. This limitation directly impacts the reliability of comprehensive code delivery."
Change:
"Output Format: Provide all code within standard Markdown code blocks (```language ... ```). The use of `<immersive type="code">` tags for code is permanently discontinued.
HTML Generation Constraint: When providing new/changed HTML, ensure only the formatting portion is considered, not any programming logic. All JavaScript must reside in external `.js` files within the `js/` directory structure.
Pre-delivery Debugging: I will perform a static code audit (syntax, logical consistency, adherence to project rules and design principles) to deliver robust code. I acknowledge that I cannot perform live runtime execution or visual testing within a browser environment. Therefore, real-world browser testing remains a crucial step for the user."
Reason: User directive to permanently use standard Markdown code blocks, explicitly prohibit <canvas>, enforce all JS in external files, and clarify the nature of internal code auditing vs. live testing. This update streamlines the development protocol based on observed limitations and user preferences.

🗂️ Jump Code Index



Jump Code
Version
File(s) Modified
Description



jump-V.36.6-1
v36.6
index.html
Updated UI structure for advanced debugger panel.


jump-V.36.6-2
v36.6
js/debug.js
Full implementation of advanced debugger system.


jump-V.37.1-1
v37.1
index.html
Refactored to single content area and new screen structure.


jump-V.37.1-2
v37.1
js/main.js
Updated event listeners for new screen elements.


jump-V.37.1-3
v37.1
js/core/game.js
Enhanced setScreen for dynamic content loading, added updateGlobalHUD.


jump-V.37.1-4
v37.1
js/systems/combat.js
Updated enablePlayerActions for new button IDs and turn logic.


jump-V.37.1-B1
v37.1
screens/battle.html
New file: Dedicated HTML structure for battle screen.


jump-V.37.1-S1
v37.1
js/screens/battle.js
New file: JavaScript module for battle screen UI logic.


jump-V.37.7-1
v37.7
index.html
Initial implementation of foundational game structure.


jump-V.37.7-2
v37.7
css/main.css
Initial global CSS styles.


jump-V.37.7-3
v37.7
css/intro.css
Initial Intro screen CSS styles.


jump-V.37.7-4
v37.7
js/core/config.js
Initial GameConfig setup.


jump-V.37.7-5
v37.7
js/core/localization.js
Initial Localization system.


jump-V.37.7-6
v37.7
js/core/game.js
Initial core Game class.


jump-V.37.7-7
v37.7
js/main.js
Initial main entry point and event listeners.


jump-V.37.7-8
v37.7
js/debug.js
Initial Debugger system.


jump-V.37.7-9
v37.7
screens/intro.html
Initial Intro screen HTML.


jump-V.37.7-10
v37.7
js/screens/intro.js
Initial Intro screen JavaScript logic.


jump-V.37.8-1
v37.8
js/core/game.js
Prevented instantiation of unimplemented systems.


jump-V.37.9-1
v37.9
index.html
Resynced core files to resolve module export error.


jump-V.37.9-2
v37.9
js/core/game.js
Resynced core files to resolve module export error.


jump-V.37.9-3
v37.9
js/main.js
Resynced core files to resolve module export error.


jump-V.37.9-4
v37.9
js/debug.js
Resynced core files to resolve module export error.


jump-V.37.10-1
v37.10
index.html
Re-delivered foundational game files.


jump-V.37.10-2
v37.10
css/main.css
Re-delivered foundational game files.


jump-V.37.10-3
v37.10
css/intro.css
Re-delivered foundational game files.


jump-V.37.10-4
v37.10
js/core/config.js
Re-delivered foundational game files.


jump-V.37.10-5
v37.10
js/core/localization.js
Re-delivered foundational game files.


jump-V.37.10-6
v37.10
js/core/game.js
Re-delivered foundational game files.


jump-V.37.10-7
v37.10
js/main.js
Re-delivered foundational game files.


jump-V.37.10-8
v37.10
js/debug.js
Re-delivered foundational game files.


jump-V.37.10-9
v37.10
screens/intro.html
Re-delivered foundational game files.


jump-V.37.10-10
v37.10
js/screens/intro.js
Re-delivered foundational game files.


jump-V.37.11-1
v37.11
index.html
Re-delivered foundational game files (Markdown).


jump-V.37.11-2
v37.11
css/main.css
Re-delivered foundational game files (Markdown).


jump-V.37.11-3
v37.11
css/intro.css
Re-delivered foundational game files (Markdown).


jump-V.37.11-4
v37.11
js/core/config.js
Re-delivered foundational game files (Markdown).


jump-V.37.11-5
v37.11
js/core/localization.js
Re-delivered foundational game files (Markdown).


jump-V.37.11-6
v37.11
js/core/game.js
Re-delivered foundational game files (Markdown).


jump-V.37.11-7
v37.11
js/main.js
Re-delivered foundational game files (Markdown).


jump-V.37.11-8
v37.11
js/debug.js
Re-delivered foundational game files (Markdown).


jump-V.37.11-9
v37.11
screens/intro.html
Re-delivered foundational game files (Markdown).


jump-V.37.11-10
v37.11
js/screens/intro.js
Re-delivered foundational game files (Markdown).


jump-V.37.11-R
v37.11
README.md
Updated Code Generation Protocol to use standard Markdown code blocks as a temporary workaround.


jump-V.37.12-R
v37.12
README.md
Permanently changed code delivery format to standard Markdown code blocks.


jump-V.37.13-1
v37.13
js/core/characters.js
Implement Character Selection screen.


jump-V.37.13-2
v37.13
js/core/config.js
Implement Character Selection screen.


jump-V.37.13-3
v37.13
js/core/localization.js
Implement Character Selection screen.


jump-V.37.13-4
v37.13
js/screens/intro.js
Implement Character Selection screen.


jump-V.37.13-5
v37.13
screens/character-select.html
Implement Character Selection screen.


jump-V.37.13-6
v37.13
css/character-select.css
Implement Character Selection screen.


jump-V.37.13-7
v37.13
js/screens/character-select.js
Implement Character Selection screen.


jump-V.37.13-8
v37.13
index.html
Implement Character Selection screen.


jump-V.37.14-1
v37.14
index.html
Character select screen layout & image 404s.


jump-V.37.14-2
v37.14
screens/character-select.html
Character select screen layout & image 404s.


jump-V.37.14-3
v37.14
css/character-select.css
Character select screen layout & image 404s.


jump-V.37.14-4
v37.14
js/screens/character-select.js
Character select screen layout & image 404s.


jump-V.37.15-1
v37.15
js/core/localization.js
Character Select screen layout, localization & button visibility.


jump-V.37.15-2
v37.15
css/main.css
Character Select screen layout, localization & button visibility.


jump-V.37.15-3
v37.15
css/character-select.css
Character Select screen layout, localization & button visibility.


jump-V.37.15-4
v37.15
screens/character-select.html
Character Select screen layout, localization & button visibility.


jump-V.37.16-1
v37.16
index.html
Language toggle icon & Character Select layout fix.


jump-V.37.16-2
v37.16
css/main.css
Language toggle icon & Character Select layout fix.


jump-V.37.16-3
v37.16
css/character-select.css
Language toggle icon & Character Select layout fix.


jump-V.37.16-4
v37.16
js/core/localization.js
Language toggle icon & Character Select layout fix.


jump-V.37.17-1
v37.17
js/core/localization.js
Integrate "Courtyard of Fate" structure with PoH aesthetics.


jump-V.37.17-2
v37.17
screens/character-select.html
Integrate "Courtyard of Fate" structure with PoH aesthetics.


jump-V.37.17-3
v37.17
css/character-select.css
Integrate "Courtyard of Fate" structure with PoH aesthetics.


jump-V.37.17-4
v37.17
js/screens/character-select.js
Integrate "Courtyard of Fate" structure with PoH aesthetics.


jump-V.37.18-1
v37.18
index.html
Provide standalone character selection test HTML.


jump-V.37.18-2
v37.18
css/main.css
Provide standalone character selection test HTML.


jump-V.37.18-3
v37.18
css/intro.css
Provide standalone character selection test HTML.


jump-V.37.18-4
v37.18
css/character-select.css
Provide standalone character selection test HTML.


jump-V.37.18-5
v37.18
js/core/config.js
Provide standalone character selection test HTML.


jump-V.37.18-6
v37.18
js/core/localization.js
Provide standalone character selection test HTML.


jump-V.37.18-7
v37.18
js/core/characters.js
Provide standalone character selection test HTML.


jump-V.37.18-8
v37.18
js/core/game.js
Provide standalone character selection test HTML.


jump-V.37.18-9
v37.18
js/main.js
Provide standalone character selection test HTML.


jump-V.37.18-10
v37.18
js/debug.js
Provide standalone character selection test HTML.


jump-V.37.18-11
v37.18
screens/intro.html
Provide standalone character selection test HTML.


jump-V.37.18-12
v37.18
screens/character-select.html
Provide standalone character selection test HTML.


jump-V.37.18-13
v37.18
js/screens/intro.js
Provide standalone character selection test HTML.


jump-V.37.18-14
v37.18
js/screens/character-select.js
Provide standalone character selection test HTML.


jump-V.37.19-1
v37.19
index.html
Complete re-delivery of core and character select files.


jump-V.37.19-2
v37.19
css/main.css
Complete re-delivery of core and character select files.


jump-V.37.19-3
v37.19
css/intro.css
Complete re-delivery of core and character select files.


jump-V.37.19-4
v37.19
css/character-select.css
Complete re-delivery of core and character select files.


jump-V.37.19-5
v37.19
js/core/config.js
Complete re-delivery of core and character select files.


jump-V.37.19-6
v37.19
js/core/localization.js
Complete re-delivery of core and character select files.


jump-V.37.19-7
v37.19
js/core/characters.js
Complete re-delivery of core and character select files.


jump-V.37.19-8
v37.19
js/core/game.js
Complete re-delivery of core and character select files.


jump-V.37.19-9
v37.19
js/main.js
Complete re-delivery of core and character select files.


jump-V.37.19-10
v37.19
js/debug.js
Complete re-delivery of core and character select files.


jump-V.37.19-11
v37.19
screens/intro.html
Complete re-delivery of core and character select files.


jump-V.37.19-12
v37.19
screens/character-select.html
Complete re-delivery of core and character select files.


jump-V.37.19-13
v37.19
js/screens/intro.js
Complete re-delivery of core and character select files.


jump-V.37.19-14
v37.19
js/screens/character-select.js
Complete re-delivery of core and character select files.


jump-V.37.20-1
v37.20
character-select-test.html
Provide standalone character selection test HTML.


jump-V.37.21-1
v37.21
screens/character-select.html
Integrate blended design into modular structure.


jump-V.37.21-2
v37.21
css/character-select.css
Integrate blended design into modular structure.


jump-V.37.21-3
v37.21
js/screens/character-select.js
Integrate blended design into modular structure.


jump-V.37.21-4
v37.21
js/core/localization.js
Integrate blended design into modular structure.


jump-V.37.21-5
v37.21
js/core/characters.js
Integrate blended design into modular structure.


jump-V.37.22-1
v37.22
index.html
Global icon positioning, layout truncation & localization.


jump-V.37.22-2
v37.22
css/main.css
Global icon positioning, layout truncation & localization.


jump-V.37.22-3
v37.22
css/character-select.css
Global icon positioning, layout truncation & localization.


jump-V.37.22-4
v37.22
js/core/localization.js
Global icon positioning, layout truncation & localization.


jump-V.37.22-5
v37.22
js/core/characters.js
Global icon positioning, layout truncation & localization.


jump-V.37.23-1
v37.23
index.html
Font Awesome icons & character select truncation.


jump-V.37.23-2
v37.23
css/character-select.css
Font Awesome icons & character select truncation.


jump-V.37.24-1
v37.24
index.html
Update Font Awesome CDN to stable version.