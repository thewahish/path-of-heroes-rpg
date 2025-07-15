Path of Heroes – Master README (v37.13)
Last Updated: July 15, 2025
GitHub Repository: https://github.com/thewahish/path-of-heroes-rpg
Current Status: In progress (~75% complete). The game engine loads with console warnings handled via safe listeners (e.g., missing IDs warn but don’t crash). Debugger is active with real-time state and console capture. Battle screen UI and functionality are under active refactor. Inventory is functional (equip/use/sort/sell). Character selection updated to v3 layout. Priorities: Complete battle UI refactor, implement random events loop, integrate shrines/shops/campfire. All code adheres to overrides (10-floor demo, random events, no map).
📘 Project Purpose & Master Record
This document is the authoritative Master Game Guide / Project Bible for Path of Heroes. It consolidates all design decisions, feature breakdowns, development notes, and critical updates. All changes must be logged via versioned commits to maintain continuity. It serves as a comprehensive game plan for backups and resuming work across AI sessions or human collaborators. The README.md must include all changes and relevant file excerpts (e.g., code snippets for context). New features or versions append changes to the changelog without overwriting existing content, ensuring project tracking.
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
Track Changes (from v37.12 to v37.13)
Jump Code Index

🎮 Game Overview
Title: Path of Heroes / طريق الأبطالGenre: 2D top-down, turn-based roguelike dungeon crawler (inspired by Hades, Dead Cells, Slay the Spire, Diablo).Platform: Mobile-only web game (HTML/CSS/JS), PWA-ready for Android/iOS.Orientation: Strictly portrait mode on all screens (fits tablets with centered content; no black bars unless necessary and without offsetting design).Technology: Multi-file, component-based structure with index.html as the entry point; modular JS/CSS in subfolders; screen HTML loaded dynamically in screens/; mockups in designs/ for testing without breaking the codebase.Languages: Bilingual (English/Arabic) with dynamic RTL switching for in-game text. Documentation is English-only.Visual Style: Dark fantasy with Arabic/English fusion, high contrast, low saturation, glowing effects for rare items.Input: Touch-only with on-screen buttons and gestures.Scope: Demo covers 10 floors in the "Ancient Ruins" biome with one boss. Full game spans 60 levels across 6 biomes:



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


Level Cap: 10 for demo, 60 for full game.
🎨 UI/UX Design Principles & Rules
Golden Rules

Portrait-Only: All screens are designed for portrait orientation. No landscape support.
Static Layouts: UI elements (containers, boxes, buttons, text) must have fixed dimensions to accommodate the longest text strings in English and Arabic, with centered text to handle varying lengths.
No Scrolling: UI layouts must fit within a standard mobile viewport without vertical scrolling.Note: The shop.html design includes a scrollable item grid (overflow-y: auto). Review and potentially refactor into a paginated view.
Safe Zones: Interactive UI elements must be within 80–95% of the screen area for accessibility and to prevent accidental taps.
No Redundant Globals: Global controls (e.g., language toggle) are part of the main game shell and must not be re-implemented in screen files.
Mobile-First Sizing: max-width: 480px.

Dark RPG Palette

Background: radial-gradient(ellipse at center, #1a0f0a 0%, #0d0604 40%, #000000 100%)
Shrine BG: assets/bg_shrine_dark_forest.jpg (verify relevance, as omitted in recent versions)
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
This section registers UI design files, stored in screens/ for production or designs/ for mockups. Only Intro and Character Selection screens are fully working (design and functionality). Other screens marked "✅ Design Complete" refer to visual blueprints, not implemented functionality.



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

game.js:setScreen(screenId): Loads screen HTML/CSS/JS and manages visibility.
js/screens/battle.js:updateBattleUI(): Refreshes player/enemy panels during combat (placeholder, to be implemented).
game.js:updateBar(barId, current, max): Updates progress bar fill (e.g., HP, Mana).
game.js:updateElement(id, value): Updates text content of HTML elements by ID.

🌍 Global HUD & UI Behavior

Global Elements: Top bar (Floor Number, Gold Count, Inventory button) managed by game.js:setScreen.
Visibility Rule: Visible only after Character Selection (e.g., encounters, shops), hidden on Main Menu and Character Selection.
Language Toggle: Fixed-position global component, not part of screen content areas.
Inventory Button Behavior:
Toggles expand/minimize on tap.
In Battle: Viewable but equipping/using items (including weapon swapping) is disabled. Closing returns to the active battle.
Outside Battle: Closing returns to the previous screen (e.g., Main Menu if no active event).



🔄 Core Gameplay Loop
The player descends floor-by-floor in a challenging, grindy dungeon, requiring multiple deaths to gather resources (gear, potions, HP, resources). The biome boss (Lich King, Floor 10) is highly difficult.

Start: Begin at Main Menu, proceed to Character Selection, start run.
Progression: Enter dungeon after Character Selection; floors driven by random events.
Encounters: Randomized events per floor (e.g., Shrine then Battle). Fleeing a battle may lead to a Campfire.
Battle: Turn-based combat against enemies.
Shop: Spend gold on items.
Shrine: Choose one of three powerful blessings.
Campfire: Rest & Heal, manage inventory, proceed to next event/floor (strategic decision point).
Boss: Face a unique enemy at biome’s end (Floor 10 for demo).
Rewards: Gain XP, Gold, Items after events.
Save/Load & Options: Not implemented in demo for faster MVP release.
Checkpoints: Autosave every 5 floors (Floors 1, 5 for demo), preserving XP, level, equipped gear.
Death & Encouragement: On HP=0, Game Over screen shows run stats (Floor Reached, XP Earned, Gold Lost) with options: "Retry from Checkpoint" or "Main Menu." Lose 90% gold, all unequipped items; respawn at checkpoint (Floors 1, 5, 10, etc.). Displays one of 20 bilingual encouragement messages.
Demo Completion: After Floor 10 boss, a modal displays: “You have beaten the demo! Please purchase the full game at https://pathofheroes.com/buy.”

🐛 Debugger System

Toggle: Activated via 🐛 icon at bottom-left.
Functionality: Displays real-time game state and logs.
Activation: Enabled when DEBUG_MODE = true.
Code Files: js/debug.js, activated by js/main.js.
Debug Panel: In index.html with header, game state (debug-content), console logs (debug-log-content), and buttons for copying logs (debug-copy-btn) and closing (debug-close-btn).

Advanced Features (v36.6)

Standalone tool with window.onerror and unhandledrejection handlers for exceptions and promise rejections.
Console interception formats objects/arrays as interactive, collapsible trees.
"Copy All Logs" button for one-click bug reporting.
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



Level Cap: 10 for demo, 60 for full game.
Ability Unlocks: Levels 1, 5, 10, 15.
Stats: HP, ATK, DEF, SPD, Crit.

⚔️ Combat System

Turn-based: Initiative based on SPD stat.
Actions: Attack, Skill, Defend, Flee.
Critical Hits: 10–20% crit chance.
Status Effects (Planned): Poison, Burn, Freeze, Stun, Shield, Regen.
Elemental Wheel (Planned): Fire > Ice > Nature > Shadow > Fire.
UI: Loaded by js/screens/battle.js, screens/battle.html, css/battle.css.
Dynamic Difficulty & Rewards Scaling: Enemy stats (HP, Attack, Defense, Speed) and rewards (XP, Gold) scale with floor number using GameConfig.DIFFICULTIES multipliers.

🎒 Inventory, Loot & Potions

Slots: Head, Shoulders, Chest, Legs, Feet, Hands, Weapon, Accessory.
Item Naming Convention: [Prefix] [Base Item Name] [Suffix/Affix] (e.g., "of the Wolf" for rare items).
Loot Drop Rules:
Enemies: Guaranteed drop (gear, potions, gold). Rarity: Common (50%), Rare (15%), Legendary (0.2%), adjustable.
Bosses: Higher-quality loot.
Item Formula: (ATK + DEF + bonus) × multiplier + affinity.


Potions & Consumables:
Types: HP Potion (restores health), Resource Potion (Elixir, restores Vigor/Mana/Energy), Antidote (cures status effects).
Acquisition: Loot, Shops, Shrines.
Usage: Counts as a turn in combat.
Item Level: Displayed on hover.



⚙️ Architecture & File Structure
The modular, multi-file structure supports dynamic screen loading. Root files (except index.html) and non-core CSS/JS files may change names/locations without updating this guide, provided modularity is maintained.
path-of-heroes-rpg/
├── .gitignore
├── index.html
├── README.md
├── archive/
│   ├── Path of Heroes - Master README (v32.3).md
│   ├── Path of Heroes - Master README (v32.4).html
│   ├── README31.md
│   ├── readme32.5.md
│   ├── version_control.md
├── assets/
│   ├── audio/
│   ├── images/
│   ├── videos/
├── css/
│   ├── main.css
│   ├── intro.css
│   ├── character-select.css
│   ├── battle.css
│   ├── shop.css
│   ├── shrine.css
│   ├── campfire.css
│   ├── game-over.css
│   ├── inventory.css
├── js/
│   ├── main.js
│   ├── debug.js
│   ├── screens/
│   │   ├── intro.js
│   │   ├── character-select.js
│   │   ├── battle.js
│   │   ├── shop.js
│   │   ├── shrine.js
│   │   ├── campfire.js
│   │   ├── game-over.js
│   ├── core/
│   │   ├── config.js
│   │   ├── game.js
│   │   ├── localization.js
│   │   ├── state.js
│   ├── systems/
│   │   ├── combat.js
│   │   ├── inventory.js
├── screens/
│   ├── intro.html
│   ├── character-select.html
│   ├── battle.html
│   ├── shop.html
│   ├── shrine.html
│   ├── campfire.html
│   ├── game-over.html
├── designs/
│   ├── campfire.html
│   ├── designs.html
│   ├── gameoverdesign.html
│   ├── newcharacters.html
│   ├── shop.html
│   ├── shrine.html
│   ├── temp.html
│   ├── victory.html

Note: Review designs/ files (e.g., designs.html, temp.html) for relevance, as they may be temporary or obsolete.
⚙️ Technical Overview
The PathOfHeroes class orchestrates game state, screen transitions, and system interactions.

Initialization (init()): Initializes core systems (localization, state, combat, inventory), sets up event listeners, starts loading sequence. Critical errors alert and halt the game.
System Initialization (initializeSystems()): Instantiates Localization, GameState, CombatSystem, InventorySystem.
Event Listeners (setupEventListeners()): Binds listeners for debugging, controls, debug panel clicks.
Loading Sequence (startLoadingSequence()): Displays progress bar before Main Menu.
Method Binding (bindMethods()): Ensures this context for event listeners/callbacks.

Core Systems

Localization: Dynamic English/Arabic text switching.
GameState: Tracks active screen, player data, floor, gold, inventory, battle status.
CombatSystem: Manages turn-based combat logic.
InventorySystem: Handles adding, equipping, using, sorting, selling items.

📝 Design Recovery & Progress Tracking
Issue: Battle Screen UI implementation has lost progress, with no working prior version.
Strategy for Recovery

Re-conceptualize/Re-design: Revisit screens/battle.html if too complex or flawed.
Mockups First: Test standalone HTML mockups in designs/ before integrating into screens/.
Simulate Execution: Internally simulate browser execution and debug mockups.
Incremental Commits: Break UI implementations into small, descriptive commits with Jump Codes.
Versioned Backups: Maintain versioned mockups with ‘stable’ checkpoints.
Communication: Flag implementation challenges for collaborative resolution.

🛠️ Development & Version Control
Rules for Developers

Use standalone HTML mockups in designs/ for new screens or major UI changes.
Simulate browser execution and debug before integration.
Add Jump Code headers (e.g., // game.js, jump-V.36.6-1) above code blocks in markdown responses, not in code files.
Append updates to changelog, never overwrite README.md sections.
For new/changed HTML, focus on formatting, not logic.
Git Branch Management: Use main or master as primary branch (verify with git branch -r). Sync with git pull or git push.
Code Output: Use standard Markdown code blocks (e.g., ```javascript) for all code, as <immersive> tags are discontinued.

Commit Message Format

Title: Version: V.X.X.X - type(scope): subject (e.g., feat(ui), fix(battle), docs(readme)).
Body: Brief paragraph explaining change and purpose.
Example:Version: V.37.1 - fix(ui): Correct battle screen layout

Refactored player stats panel to single-column layout for readability. Added padding to resolve overlap with language selector.



✅ Log of Major Historical Updates

v30–v31: Initial setup, scope definition, core mechanics.
v32: Overhauled UI/UX with new screen designs (Character Selection, Dungeon Map, Shop, Shrine, Campfire, Game Over).
v32.1: Added Version Control and AI Collaboration rules.
v32.2: Introduced UI & Screen Design Blueprints table.
v32.3: Moved mockups to designs/; updated paths.
v32.4: Added "Static Layouts" rule for UI consistency.
v32.5: Finalized battle screen design; set global UI rules; clarified loot/potion systems.
v32.6–v32.8: Implemented Global HUD, refactored Character Selection and Battle screens, added guaranteed loot drops.
v32.9: Consolidated project info into README.md.
v36.5 – July 13, 2025:
Updated death penalty to respawn at checkpoints (Floors 1, 5, 10, etc.).
Renamed folder to path-of-heroes-rpg/.
Mandated appending updates to README.md with code excerpts.
Reworded documentation for AI compatibility.


v36.6 – July 13, 2025:
feat(dev): Overhauled debugger with window.onerror, unhandledrejection, console interception, "Copy All Logs" button.
docs(readme): Added Jump Code Index.


v36.9 – July 14, 2025:
docs(readme): Added Technical Overview, expanded Game Overview, refined Gameplay Loop, added Dynamic UI Updates and Difficulty Scaling, clarified inventory restrictions, removed Konami Code.


v37.0 – July 14, 2025:
docs(readme): Corrected Italian to English; introduced screens/ with screen-specific HTML/CSS/JS; retained designs/.


v37.1 – July 15, 2025:
docs(readme): Clarified Battle screen refactor, added js/screens/, updated Game Overview, added dynamic UI functions, Combat System UI details.


v37.3 – July 15, 2025:
docs(readme): Clarified English-only documentation, reformatted file tree, added Debug Panel details, Git Branch Management.


v37.4 – July 15, 2025:
docs(readme): Added archive/ and assets/, listed screen-specific files, removed test.txt, noted designs/dungeonprogress.html, designs/proof.html for review.


v37.6 – July 15, 2025:
docs(readme): Removed obsolete designs/ files (battle.png, battlescreen.html, split_code.bat, dungeonprogress.html, proof.html).


v37.7 – July 15, 2025:
docs(readme): Initial implementation of foundational game structure, intro screen, debugger.


v37.8 – July 15, 2025:
docs(readme): Prevented instantiation of unimplemented systems in js/core/game.js.


v37.9 – July 15, 2025:
docs(readme): Resynced core files to resolve module export error.


v37.10 – July 15, 2025:
docs(readme): Re-delivered foundational game files.


v37.11 – July 15, 2025:
docs(readme): Adopted Markdown code blocks as temporary workaround for copy issues.


v37.12 – July 15, 2025:
docs(readme): Permanently adopted Markdown code blocks, discontinued <immersive> tags.



🔄 Track Changes (from v37.12 to v37.13)

Version Number Update: Updated from v37.12 to v37.13.
UI/UX Design Principles & Rules:
Previous: Omitted Shrine BG: assets/bg_shrine_dark_forest.jpg in Dark RPG Palette.
Change: Re-added Shrine BG with a note to verify relevance, as it was present in earlier versions (e.g., v37.0).
Reason: Ensures no potential design asset is lost; flagged for review.


Architecture & File Structure:
Previous: Listed designs/ files without noting potential obsolescence.
Change: Added note to review designs/ files (e.g., designs.html, temp.html) for relevance.
Reason: Some files may be temporary or obsolete, requiring cleanup.


Development & Version Control:
Previous: Noted permanent adoption of Markdown code blocks.
Change: Explicitly clarified that all code output uses standard Markdown code blocks, reinforcing removal of <immersive> tags.
Reason: Aligns with user request for a fresh start and standardized code delivery.


Formatting:
Previous: Inconsistent header spacing and table alignment in v37.12.
Change: Improved markdown formatting with consistent headers, spaced tables, and clearer section breaks.
Reason: Enhances readability and professionalism.



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
Updated Code Generation Protocol to use Markdown code blocks as temporary workaround.

