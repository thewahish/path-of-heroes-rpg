# Path of Heroes – Master README (v37.3)
Last Updated: July 15, 2025

GitHub Repository: https://github.com/thewahish/path-of-heroes-rpg

Current Status: In progress (~75% complete). Game engine loads with console warnings handled via safe listeners (e.g., missing IDs warn but don't crash). Debugger active with real-time state and console capture. Battle screen UI and functionality are under active refactor. Inventory functional (equip/use/sort/sell). Character select updated to v3 layout. Prioritize: Complete battle UI refactor, implement random events loop, shrines/shops/campfire integration. All code adheres to overrides (10-floor demo, random events, no map).

📘 Project Purpose & Master Record
This document is the authoritative Master Game Guide / Project Bible for Path of Heroes. It consolidates all design decisions, feature breakdowns, development notes, and critical updates. All changes must be logged here via versioned commits to maintain continuity. It serves as a comprehensive master gameplan for backups and resuming work. The README.md file should always contain everything, including all changes and all original files (e.g., code excerpts if relevant for context), so it can be used in other chats when needed. If new features are committed and a new version is made, those changes in README.md should not replace existing content but rather add to them, with a changes log appended at the bottom. This is CRITICAL for tracking the project throughout when moving between different AI sessions or human collaborators.

📂 Contents
Full visual, structural, and gameplay documentation
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
Track Changes (from v37.2 to v37.3)

🗂️ Jump Code Index
This table provides a quick reference to locate specific code changes committed to the project.

| Jump Code          | Version | File(s) Modified             | Description                                          |
| :----------------- | :------ | :--------------------------- | :--------------------------------------------------- |
| jump-V.36.6-1      | v36.6   | index.html                   | Updated the UI structure for the advanced debugger panel. |
| jump-V.36.6-2      | v36.6   | js/debug.js                  | Full implementation of the advanced debugger system. |
| jump-V.37.1-1      | v37.1   | index.html                   | Initial refactor to single content area and new screen structure. |
| jump-V.37.1-2      | v37.1   | js/main.js                   | Updated event listeners to match new screen elements. |
| jump-V.37.1-3      | v37.1   | js/core/game.js              | Enhanced `setScreen` for dynamic content loading, new `updateGlobalHUD`. |
| jump-V.37.1-4      | v37.1   | js/systems/combat.js         | Updated `enablePlayerActions` for new button IDs and enhanced turn logic. |
| jump-V.37.1-B1     | v37.1   | screens/battle.html          | **NEW FILE:** Dedicated HTML structure for the battle screen. |
| jump-V.37.1-S1     | v37.1   | js/screens/battle.js         | **NEW FILE:** JavaScript module for battle screen UI logic. |


Export to Sheets
🎮 Game Overview
Title: Path of Heroes / طريق الأبطال
Genre: 2D top-down, turn-based roguelike dungeon crawler (inspired by Hades, Dead Cells, Slay the Spire, Diablo).
Platform: Mobile-only web game (HTML/CSS/JS), PWA-ready for Android/iOS.
Orientation: Strictly portrait mode on all screens (fits tablets with centered content; preferably no black bars unless needed and unless it won't change the whole design and make it offset).
Technology: Multi-file, component-based structure with `index.html` as entry point; modular JS/CSS in subfolders; screen HTML loaded dynamically in `screens/` folder; mockups in `designs/` for testing without breaking the main codebase.
Languages: Fully bilingual (English/Arabic) with dynamic RTL switching.
Visual Style: Dark fantasy with Arabic/English fusion, high contrast, low saturation, glowing effects for rare items.
Input: Touch-only with on-screen buttons and gestures.
Scope: The demo is only 10 floors. Each Biome is 10 floors. There's only one boss per demo, then a demo completion message. The full game is 60 levels, structured across 6 biomes as follows:

| Floors  | Biome           | Enemies               | Boss      |
| :------ | :-------------- | :-------------------- | :-------- |
| 1–10    | Ancient Ruins   | Skeletons, Slimes     | Lich King |
| 11–20   | Sand            | (Planned for full game) | (Planned) |
| 21–30   | Fire            | (Planned for full game) | (Planned) |
| 31–40   | Ice             | (Planned for full game) | (Planned) |
| 41–50   | Water           | (Planned for full game) | (Planned) |
| 51–60   | Wind            | (Planned for full game) | (Planned) |

The level cap for the demo is 10, corresponding to the single "Ancient Ruins" biome.

🎨 UI/UX Design Principles & Rules
Golden Rules:

Portrait-Only: All screens are designed and optimized exclusively for portrait orientation. No landscape support will be implemented.
Static Layouts (Fixed Size Elements): All UI elements, including containers, boxes, buttons, and text elements, must have static, fixed dimensions. These dimensions should be calculated to accommodate the longest possible text strings across all supported languages (English and Arabic), and for the largest possible font types/sizes, without causing the element to resize or shift the layout. Text within these elements should be centered to handle varying string lengths gracefully. This ensures UI consistency regardless of content.
No Scrolling: UI layouts must fit within a standard mobile viewport without requiring vertical scrolling.  Note: The `shop.html` design includes a scrollable item grid (`overflow-y: auto`). This must be reviewed and potentially refactored into a paginated view to adhere to this rule.
Safe Zones: All interactive UI elements should be contained within 80-95% of the screen area to ensure accessibility and prevent accidental taps on all devices.
No Redundant Globals: Global controls like the language toggle are part of the main game shell and should not be re-implemented or redesigned within individual screen files.
Mobile-First Sizing: `max-width: 480px`
Dark RPG Palette:

Background: `radial-gradient(ellipse at center, #1a0f0a 0%, #0d0604 40%, #000000 100%)`
Primary: `#d4a656`
Secondary: `#5c4423`
Text: `#f8e4c0`
Health: `linear-gradient(90deg, #8b0000, #ff4500, #ff6347)`
Mana: `linear-gradient(90deg, #191970, #4169e1, #87ceeb)`
Rarity Colors:
Common: Gray (`#95a5a6`)
Uncommon: Green (`#27ae60`)
Rare: Blue (`#3498db`)
Epic: Purple (`#9b59b6`)
Mythic: Orange (`#e67e22`)
Legendary: Gold (`#f1c40f`)

🖥️ UI & Screen Design Blueprints
This section serves as the official registry for all UI design files. The files are the visual and functional source of truth and are stored in the `screens/` directory for production or `designs/` for mockups.
Important Note: Only the "Intro" and "Character Selection" screens are currently confirmed to be working with their intended design and functionality. The status of other screens (marked as ✅ Design Complete) refers to the completion of their visual design blueprints, not their implemented and functional status in the game engine.

| Screen/Feature      | Design File              | Status                         | Key Functionality                                   |
| :------------------ | :----------------------- | :----------------------------- | :-------------------------------------------------- |
| Intro               | `screens/intro.html`     | ✅ Working (Design & Functionality) | Initial game entry point with Main Menu.            |
| Character Selection | `screens/character-select.html` | ✅ Working (Design & Functionality) | Select hero via tabs, view stats, start a new run.  |
| Battle Screen       | `screens/battle.html`    | ✅ Design Complete             | Engage in turn-based combat, use skills and items.  |
| Shop / Merchant     | `screens/shop.html`      | ✅ Design Complete             | View gold, browse items for sale, buy items.        |
| Shrine              | `screens/shrine.html`    | ✅ Design Complete             | Choose one of three powerful blessings.              |
| Campfire            | `screens/campfire.html`  | ✅ Design Complete             | Heal the player, open inventory, or save progress; option to proceed to next random event/floor. |
| Game Over           | `screens/game-over.html` | ✅ Design Complete             | View run statistics, retry from checkpoint, or return to the main menu. |

Dynamic UI Element Updates:
The game dynamically updates UI elements (like HP/resource bars, stat displays) using core functions. Key functions responsible for this include:
* `game.js:setScreen(screenId)`: Centralized function for loading screen HTML/CSS/JS and managing visibility.
* `js/screens/battle.js:updateBattleUI()`: Handles the overall refreshing of player and enemy panels during combat (placeholder, to be implemented in screen-specific JS).
* `game.js:updateBar(barId, current, max)`: Updates the visual fill percentage of progress bars (e.g., HP, Mana).
* `game.js:updateElement(id, value)`: Updates the text content of specific HTML elements by ID.

🌍 HUD & Global UI Behavior
This section defines the behavior of persistent, global UI elements.

Global Elements: The top bar containing Floor Number, Gold Count, and the Inventory button is a global element, managed by `game.js:setScreen`.
Visibility Rule: These global elements should only be visible on screens that appear after Character Selection (e.g., in encounters, shops). They must not appear on the Main Menu or Character Selection screens.
Language Toggle: The language toggle button is a global component with a fixed position throughout the entire application and is not considered part of any specific screen's content area.
Inventory Button Behavior:
The inventory button expands/minimizes on tap.
In Battle: When in battle, the inventory can be viewed, but equipping or using items (including weapon swapping) is not allowed. Closing the inventory will return the player to the active battle.
Outside Battle: Closing the inventory will return the player to the previous screen (e.g., Main Menu if not in an active event).

🔄 Core Gameplay Loop
The player's journey is a floor-by-floor descent through a dungeon. The game is designed to be challenging and grindy, requiring multiple deaths to accumulate sufficient resources (gear, potions, HP, resource) to overcome even small enemies. The final biome boss should be very difficult.

Start: The player begins at the Main Menu, proceeds to Character Selection, and starts the run.
Progression: After Character Selection, the player immediately proceeds into the dungeon. Progression through floors is driven by random events.
Encounters: Each floor presents a randomized sequence of events. There can be occurrences of more than one event back-to-back (e.g., Shrine then Battle, or Shop then Battle). Successfully fleeing a battle might lead to a Campfire, etc.
Battle: Standard turn-based combat against enemies.
Shop: Opportunity to spend gold on items from a merchant.
Shrine: Offer a choice of three powerful blessings.
Campfire: A safe room to Rest & Heal, manage inventory. From the Campfire, players will have an option to manually proceed to the next random event/floor, making it a strategic decision point.
Boss: A unique, powerful enemy at the end of a biome (e.g., Floor 10 for the demo, Lich King).
Rewards: After clearing an event, the player gains rewards (XP, Gold, Items).
Save/Load & Options (Demo Status): For faster MVP release, save/load and options features will not be working in the demo.
Checkpoints: Autosave occurs every 5 floors, preserving XP, level, and equipped gear. For the 10-floor demo, this means autosave points are at Floor 1 (start) and Floor 5.
Death & Encouragement: If the player's HP drops to zero, the Game Over screen appears. It displays stats for the run (Floor Reached, XP Earned, Gold Lost) and presents two choices: "Retry from Checkpoint" or "Main Menu." Upon death, the player loses 90% of gold and all unequipped items, then respawns at the nearest respawn point (Floors 1, 5, 10, 15, 20, etc.).
Encouragement Messages: Every time the player dies, one of 20 pre-saved bilingual (English/Arabic) messages will be displayed to encourage them.
Demo Completion: After defeating the Floor 10 boss, a modal will appear: “You have beaten the demo! Please purchase the full game at https://pathofheroes.com/buy.”

🐛 Debugger System
Toggle: Activated via a 🐛 icon at the bottom-left of the screen.
Functionality: Shows real-time game state and logs.
Activation: Active only when `DEBUG_MODE = true`.
Code Files: Primarily `js/debug.js`, activated by `js/main.js`.
Advanced Features (v36.6):
Overhauled into an advanced, standalone tool.
Implements global `window.onerror` and `unhandledrejection` handlers to catch all runtime exceptions and promise rejections with full stack traces.
Rewrites console interception to intelligently format and display objects/arrays as interactive, collapsible trees.
Includes a "Copy All Logs" button for easy, one-click bug reporting.
Updated the debug panel UI in `index.html` to support the new features.

🧙 Playable Characters
| Class     | Name          | Resource  | Role         | Specialization                  |
| :-------- | :------------ | :-------- | :----------- | :------------------------------ |
| Warrior   | Taha / طه     | 🟣 Vigor   | Tank / Melee | 🛡️ High DEF, ❤️ High HP           |
| Sorceress | Mais / ميس     | 🔵 Mana    | Ranged Mage  | 🔮 AoE, ❄️ Crowd Control           |
| Rogue     | Ibrahim / إبراهيم | 🟢 Energy  | Assassin     | ⚡ High SPD, 💥 High Crit         |

Level Cap: 10 for the demo, 60 for the full game.
Ability Unlocks: Abilities unlock at Level 1, 5, 10, 15.
Stats: HP, ATK, DEF, SPD, Crit.

⚔️ Combat System
Turn-based: Initiative is determined by SPD (Speed) stat.
Actions: Players can choose from Attack, Skill, Defend, or Flee.
Critical Hits: Crit chance is currently 10–20%.
Status Effects (planned): Poison, Burn, Freeze, Stun, Shield, Regen.
Elemental Wheel (planned): Fire > Ice > Nature > Shadow > Fire.
UI: The combat UI is now dynamically loaded and managed by `js/screens/battle.js`, in conjunction with `screens/battle.html` and `css/screens/battle.css`.
Dynamic Difficulty & Rewards Scaling:
The game incorporates dynamic scaling to ensure challenge. Enemy stats (HP, Attack, Defense, Speed) will increase with higher floor numbers. Similarly, XP and gold rewards from enemies will scale up to match the increased difficulty. This scaling is derived from `GameConfig.DIFFICULTIES` multipliers.

🎒 Inventory, Loot & Potions
Slots: Head, Shoulders, Chest, Legs, Feet, Hands, Weapon, Accessory.
Item Naming Convention: Items follow a clear naming convention.
Formula: `[Prefix] [Base Item Name] [Suffix/Affix]`
Prefixes/Affixes: A set of pre-saved options/variables will be used to create prefixes and affixes. Higher rarity gear will have special affixes or prefixes.
Example: "of the Wolf" could be a suffix for rare items.
Loot Drop Rules:
Enemies: Every non-boss enemy is guaranteed to drop a loot item upon defeat. This drop is not always gear but can include other items like potions or gold.
Rarity: The item's rarity (Common, Uncommon, Rare, etc.) is determined by weighted percentages (e.g., Common: 50%, Rare: 15%, Legendary: 0.2%). These formulas are flexible for balancing and difficulty adjustments.
Bosses: Bosses drop a selection of major, higher-quality loot.
Item Formula: `(ATK + DEF + bonus) × multiplier + affinity`
Potions & Consumables:
Types: Players can find and use various consumables, including:
HP Potion: Restores health.
Resource Potion (Elixir): Restores a primary resource (Vigor, Mana, Energy).
Antidote: Cures negative status effects like poison.
Acquisition: These items can be found as loot, purchased from Shops, or awarded at Shrines.
Usage: Using a consumable during combat counts as a player's turn.
Item Level: Always shown on hover for player convenience.

⚙️ Architecture & File Structure
This outlines the new modular, component-based file architecture for the project. The goal is to separate concerns by screen and type, improving maintainability, scalability, and debugging.

path-of-heroes-rpg/
├───.gitignore
├───index.html                     <-- Main entry point; contains global UI & #app-content for screen injection
│
├───assets/                        <-- Game assets (images, audio, etc.)
│   ├───audio/
│   ├───images/
│   └───videos/
│   └── bg_shrine_dark_forest.jpg
│
├───css/
│   ├───global/                    <-- Global/base CSS styles applying to the entire application
│   │   └── main.css               <-- Core styles, typography, global layout (previously all of main.css)
│   ├───screens/                   <-- Screen-specific CSS files
│   │   ├── battle.css             <-- Styles specific to the battle screen
│   │   ├── inventory.css          <-- Styles specific to the inventory screen
│   │   ├── character_selection.css  <-- NEW (planned): Styles specific to character selection screen
│   │   └── main_menu.css          <-- NEW (planned): Styles specific to main menu screen
│   └── reset.css                  <-- NEW: Basic CSS reset to ensure consistent styling across browsers
│
├───designs/                       <-- Design blueprints and mockups (static HTML/PNGs)
│   ├─ battle.png
│   ├─ battlescreen.html
│   ├─ campfire.html
│   ├─ designs.html
│   ├─ gameoverdesign.html
│   ├─ newcharacters.html
│   ├─ shop.html
│   ├─ shrine.html
│   ├─ split_code.bat
│   ├─ temp.html
│   └─ victory.html
│
├───js/
│   ├───core/                      <-- Core game engine and shared utilities
│   │   ├── config.js              <-- Game configuration constants
│   │   ├── game.js                <-- Main game class; orchestrates screen transitions, global state updates
│   │   ├── localization.js        <-- Language management
│   │   └── state.js               <-- Game state management (player, inventory, progress)
│   ├───screens/                   <-- JavaScript modules for screen-specific UI logic and events
│   │   ├── battle.js              <-- Handles battle screen DOM interactions and UI updates
│   │   ├── inventory.js           <-- Handles inventory screen DOM interactions and UI updates
│   │   ├── character_selection.js   <-- NEW (planned): Handles character selection UI
│   │   └── main_menu.js           <-- NEW (planned): Handles main menu UI
│   ├───systems/                   <-- Core game mechanics/systems (decoupled from direct UI)
│   │   ├── combat.js              <-- Core combat logic (damage, turns, abilities)
│   │   └── inventory.js           <-- Core inventory logic (add, remove, equip, unequip, sell)
│   └── debug.js                   <-- Debugger system implementation
│   └── main.js                    <-- Application entry point; initializes core systems and global listeners
│
└───screens/                       <-- NEW: HTML template files for each major game screen
├── battle.html                <-- HTML markup for the battle screen content
├── inventory.html             <-- HTML markup for the inventory screen content
├── character_selection.html   <-- HTML markup for the character selection screen content (moved from index.html)
├── main_menu.html             <-- HTML markup for the main menu screen content (moved from index.html)
├── loading_screen.html        <-- NEW (planned): HTML markup for loading screen
└── game_over.html             <-- NEW (planned): HTML markup for game over screen


⚙️ Technical Overview
This section outlines the foundational technical aspects and core responsibilities of the PathOfHeroes game class.

Main Game Class (`PathOfHeroes` in `js/core/game.js`): The central class that orchestrates the entire game. It manages overall state, dynamically loads screen content, and coordinates interactions between different game systems.

Initialization (`init()`): The entry point for starting the game. It initializes core systems (localization, state, combat, inventory), sets up global event listeners, and begins the loading sequence. Critical errors during initialization will alert the user and halt the game.

Screen Management (`setScreen(screenId)`): A crucial new method responsible for:
* Hiding the previously active screen.
* Dynamically loading the HTML content from `screens/{screenId}.html` into a central `#app-content` div in `index.html`.
* Dynamically loading the relevant CSS (`css/screens/{screenId}.css`) and JavaScript (`js/screens/{screenId}.js`) for the new screen.
* Initializing the screen-specific JavaScript module's logic.
* Ensuring any previously loaded screen's CSS/JS is removed or deactivated to prevent conflicts and memory leaks.
* Managing the visibility of the global HUD.

System Initialization (`initializeSystems()`): Responsible for instantiating and initializing key game modules like Localization, GameState, CombatSystem, and InventorySystem.

Event Listeners (`setupEventListeners()`): Binds essential global event listeners, such as keyboard input for debugging or game controls, and click listeners for the debug panel.

Loading Sequence (`startLoadingSequence()`): Manages the initial loading progression of the game, displaying a progress bar before transitioning to the Main Menu.

Method Binding (`bindMethods()`): Crucial for ensuring that class methods maintain their `this` context when used as event listeners or callbacks.

Core Systems:
* Localization: Handles dynamic language switching for all in-game text.
* GameState: Manages the current state of the game, including active screen, player data, current floor, gold, inventory, and battle status.
* CombatSystem: Orchestrates turn-based combat logic (now decoupled from direct UI manipulation).
* InventorySystem: Manages player inventory, including adding, equipping, using, sorting, and selling items (now decoupled from direct UI manipulation).

📝 Design Recovery & Progress Tracking
Issue: The Battle Screen UI implementation has encountered significant issues, resulting in lost progress and an inability to locate a previously working version.

Strategy for Recovery and Future Development:
To prevent similar setbacks and ensure robust progress, we will adopt the following approach:

Re-conceptualize/Re-design if necessary: If the existing `designs/battle.html` proves too difficult to implement robustly or has inherent flaws, we will revisit its core concept.

Mockups First (Strict Adherence): Before any new code is integrated into the core codebase, a standalone HTML mockup (with dummy logs) for the screen or feature must be created and fully tested. This will focus solely on visual layout and intended interactions.

Incremental Commits: Break down complex UI implementations into smaller, manageable commits. Each commit should be accompanied by a clear description and Jump Codes.

Versioned Design Backups: Ensure all approved design mockups are consistently versioned and backed up, perhaps with explicit 'stable' checkpoints for crucial screens.

Regular Communication: Explicitly flag any implementation challenges or significant deviations from design during development for discussion and collaborative problem-solving.

🛠️ Development & Version Control
Rules for AI or Human Devs:

* Use mockups first (standalone HTML with dummy logs) for new screens or significant UI changes.
* **Modular Development**: Prioritize creating separate files for screen HTML (`screens/`), screen-specific CSS (`css/screens/`), and screen-specific JavaScript (`js/screens/`) as outlined in "Architecture & File Structure."
* **Decoupling UI and Logic**: Game system classes (e.g., `CombatSystem`, `InventorySystem`) should focus purely on game mechanics and avoid direct DOM manipulation beyond simple status updates via `game.updateElement`. UI updates should primarily be handled by the screen-specific JavaScript modules.
* Commit Format: All commit messages must follow a strict three-part structure: Title, Body, and Footer.

The Commit Message Rule

Purpose: To keep our project history clean, professional, and easy to understand.

The Format:
Our commit messages have three parts: a Title, a Body, and a Footer. In VS Code's single message box, the first line is the Title. After one blank line, the rest of the text is the Body and Footer.

Title: A short summary of the change.

Format: `Version: V.X.X.X - type(scope): subject`

`type` examples: `feat` (new feature), `fix` (bug fix), `refactor`, `style`, `docs`, `chore`.

`scope` examples: `ui`, `core`, `battle`, `inventory`, `project`, `arch`.

Body: (Optional but preferred) A brief paragraph explaining what the change is and why it was made.

Footer: A single line at the very end for any additional versioning or related notes.

Example:

Version: V.2.0.1 - fix(ui): Correct battle screen layout

Refactors the player stats panel to a single-column layout for better readability. Also adds padding to the main container to resolve an overlap with the language selector.

✅ Log of Major Historical Updates
* v30 - v31: Initial project setup, scope definition, and core mechanics established.
* v32: Overhauled UI/UX with new screen designs for Character Selection, Dungeon Map, Shop, Shrine, Campfire, and Game Over.
* v32.1: Added formal Version Control and AI Collaboration rules.
* v32.2: Added the UI & Screen Design Blueprints table to the guide.
* v32.3: Reorganized project structure to place all design mockups in a dedicated `/designs` folder. Updated guide to reflect new paths.
* v32.4: Added the "Static Layouts" master rule to ensure UI dimensions do not change when switching languages.
* v32.5: Finalized the battle screen design. Established new rules for the global UI (Floor/Gold/Inventory display). Updated and clarified loot drop and potion/elixir systems.
* v32.6 - v32.8: Implemented the Global HUD, refactored the Character Selection and Battle screens, and implemented the guaranteed loot drop system.
* v32.9: Consolidated all project information into a single, authoritative `README.md` file. This file was intended as the single source of truth, with all future changes tracked via Git commits.
* v36.5 – July 13, 2025:
    * Updated death penalty to "respawn at respawn point which is 1,5,10,15,20, etc."
    * Changed architecture folder name to `path-of-heroes-rpg/`.
    * Updated `README.md` rule: all updates must be appended, not overwritten. Include code excerpts where necessary.
    * Reworded and finalized documentation formatting for AI compatibility and future-proofing.
* v36.6 – July 13, 2025:
    * `feat(dev)`: Overhauled the debugger system into an advanced, standalone tool.
    * Implemented global `window.onerror` and `unhandledrejection` handlers to catch all runtime exceptions and promise rejections with full stack traces.
    * Rewrote console interception to intelligently format and display objects/arrays as interactive, collapsible trees.
    * Added a "Copy All Logs" button for easy, one-click bug reporting.
    * Updated the debug panel UI in `index.html` to support the new features.
    * `docs(readme)`: Added a Jump Code Index section to track all versioned code changes for easy navigation.
* v37.0 – July 14, 2025:
    * `docs(readme)`: Updated README version from v36.9 to v37.0.
    * `docs(readme)`: Removed AI-specific rules from "Development & Version Control" section, as these now reside in the Master GPT Prompt. This includes the "Jump Code" Navigation Rule, internal debugging simulation, README overwrite prevention, and HTML formatting constraints.
    * `docs(readme)`: Clarified Master GPT Prompt as the explicit location for AI interaction protocols.
    * `docs(readme)`: Ensured detailed 6-biome structure for the full game is correctly presented in "Game Overview."
* v37.1 – July 15, 2025:
    * `fix(ui, battle)`: Initial refactor to single content area and new screen structure for battle UI.
    * `fix(ui, battle)`: Updated `main.js` event listeners to match new screen elements.
    * `refactor(core)`: Enhanced `game.js:setScreen` for dynamic content loading and added `updateGlobalHUD`.
    * `fix(combat)`: Updated `js/systems/combat.js:enablePlayerActions` for new button IDs and enhanced turn logic.
    * `feat(arch)`: **NEW FILE:** `screens/battle.html` created as a dedicated HTML structure for the battle screen.
    * `feat(arch)`: **NEW FILE:** `js/screens/battle.js` created as a JavaScript module for battle screen UI logic.

🔄 Track Changes (from v37.2 to v37.3)
This section details the specific changes made to update the README from v37.2 to v37.3, formalizing the shift to a more granular, component-based architecture for "Path of Heroes."

**Version Number Update:** The overall README version updated from v37.2 to **v37.3**.

**Core Architectural Shift Formalization:**
* **`Architecture & File Structure` (Complete Overhaul):** This section has been entirely rewritten to detail the new, granular file structure.
    * **New Top-Level Directories:** Introduced `screens/` for HTML templates.
    * **`css/` Subdirectories:** Added `css/global/` and `css/screens/` to separate global and screen-specific styles. Added `reset.css`.
    * **`js/` Subdirectories:** Added `js/screens/` for screen-specific JavaScript logic, distinguishing it from `js/systems/` (core mechanics) and `js/core/` (engine).
    * **Detailed descriptions:** Each new and existing directory/file type now has a clear explanation of its purpose within the modular structure.
* **`Technical Overview` (Major Update):**
    * **New "Screen Management (`setScreen(screenId)`)" section:** This is a crucial addition detailing the dynamic loading of HTML, CSS, and JS for each screen, and managing HUD visibility.
    * **Updated "Main Game Class (`PathOfHeroes`)" description:** Emphasizes its role in dynamically loading screen content.
    * **Updated "Core Systems" descriptions:** Clarified that `CombatSystem` and `InventorySystem` are now "decoupled from direct UI manipulation."
* **`Development & Version Control` (New Rules for AI/Human Devs):**
    * Added `Modular Development` rule: Explicitly guides developers to use the new `screens/`, `css/screens/`, and `js/screens/` directories.
    * Added `Decoupling UI and Logic` rule: Reinforces that system classes should avoid direct DOM manipulation.

**Minor Content Alignment (from v37.2 to v37.3, based on previous discussion):**
* **"Technology" in Game Overview:** Updated to explicitly mention `screen HTML loaded dynamically in screens/ folder`.
* **"UI & Screen Design Blueprints" table:** Updated "Design File" paths for `Intro` and `Character Selection` to `screens/intro.html` and `screens/character-select.html` respectively, and added `screens/game-over.html`. (This aligns with the new `screens/` directory for production HTML.)
* **"Dynamic UI Element Updates" in UI/UX Design Principles & Rules:** Clarified `js/screens/battle.js:updateBattleUI()` as a placeholder for screen-specific UI updates.
* **"Visibility Rule" in Global HUD & UI Behavior:** Explicitly states "managed by `game.js:setScreen`."
* **"UI" in Combat System:** Confirmed UI is "dynamically loaded and managed by `js/screens/battle.js`, in conjunction with `screens/battle.html` and `css/screens/battle.css`."

All other sections and details from v37.2 were retained as they pertain to the game's design and content.