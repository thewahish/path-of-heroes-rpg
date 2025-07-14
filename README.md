Path of Heroes – Master README (v37.3)
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



Jump Code
Version
File(s) Modified
Description



jump-V.36.6-1
v36.6
index.html
Updated the UI structure for the advanced debugger panel.


jump-V.36.6-2
v36.6
js/debug.js
Full implementation of the advanced debugger system.


jump-V.37.1-1
v37.1
index.html
Initial refactor to single content area and new screen structure.


jump-V.37.1-2
v37.1
js/main.js
Updated event listeners to match new screen elements.


jump-V.37.1-3
v37.1
js/core/game.js
Enhanced setScreen for dynamic content loading, new updateGlobalHUD.


jump-V.37.1-4
v37.1
js/systems/combat.js
Updated enablePlayerActions for new button IDs and enhanced turn logic.


jump-V.37.1-B1
v37.1
screens/battle.html
NEW FILE: Dedicated HTML structure for the battle screen.


jump-V.37.1-S1
v37.1
js/screens/battle.js
NEW FILE: JavaScript module for battle screen UI logic.


🎮 Game Overview
Title: Path of Heroes / طريق الأبطالGenre: 2D top-down, turn-based roguelike dungeon crawler (inspired by Hades, Dead Cells, Slay the Spire, Diablo).Platform: Mobile-only web game (HTML/CSS/JS), PWA-ready for Android/iOS.Orientation: Strictly portrait mode on all screens (fits tablets with centered content; preferably no black bars unless needed and unless it won't change the whole design and make it offset).Technology: Multi-file, component-based structure with index.html as entry point; modular JS/CSS in subfolders; screen HTML loaded dynamically in screens/ folder; mockups in designs/ for testing without breaking the main codebase.Languages: Fully bilingual (English/Arabic) with dynamic RTL switching for in-game text. Documentation is in English only.Visual Style: Dark fantasy with Arabic/English fusion, high contrast, low saturation, glowing effects for rare items.Input: Touch-only with on-screen buttons and gestures.Scope: The demo is only 10 floors. Each Biome is 10 floors. There's only one boss per demo, then a demo completion message. The full game is 60 levels, structured across 6 biomes as follows:



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
(Planned for full game)
(Planned)


21–30
Fire
(Planned for full game)
(Planned)


31–40
Ice
(Planned for full game)
(Planned)


41–50
Water
(Planned for full game)
(Planned)


51–60
Wind
(Planned for full game)
(Planned)


The level cap for the demo is 10, corresponding to the single "Ancient Ruins" biome.
🎨 UI/UX Design Principles & Rules
Golden Rules:

Portrait-Only: All screens are designed and optimized exclusively for portrait orientation. No landscape support will be implemented.
Static Layouts (Fixed Size Elements): All UI elements, including containers, boxes, buttons, and text elements, must have static, fixed dimensions. These dimensions should be calculated to accommodate the longest possible text strings across all supported languages (English and Arabic), and for the largest possible font types/sizes, without causing the element to resize or shift the layout. Text within these elements should be centered to handle varying string lengths gracefully. This ensures UI consistency regardless of content.
No Scrolling: UI layouts must fit within a standard mobile viewport without requiring vertical scrolling.  
Note: The shop.html design includes a scrollable item grid (overflow-y: auto). This must be reviewed and potentially refactored into a paginated view to adhere to this rule.


Safe Zones: All interactive UI elements should be contained within 80-95% of the screen area to ensure accessibility and prevent accidental taps on all devices.
No Redundant Globals: Global controls like the language toggle are part of the main game shell and should not be re-implemented or redesigned within individual screen files.
Mobile-First Sizing: max-width: 480px

Dark RPG Palette:

Background: radial-gradient(ellipse at center, #1a0f0a 0%, #0d0604 40%, #000000 100%)
Primary: #d4a656
Secondary: #5c4423
Text: #f8e4c0
Health: linear-gradient(90deg, #8b0000, #ff4500, #ff6347)
Mana: linear-gradient(90deg, #191970, #4169e1, #87ceeb)
Rarity Colors:
Common: Gray (#95a5a6)
Uncommon: Green (#27ae60)
Rare: Blue (#3498db)
Epic: Purple (#9b59b6)
Mythic: Orange (#e67e22)
Legendary: Gold (#f1c40f)



🖥️ UI & Screen Design Blueprints
This section serves as the official registry for all UI design files. The files are the visual and functional source of truth and are stored in the screens/ directory for production or designs/ for mockups.
Important Note: Only the "Intro" and "Character Selection" screens are currently confirmed to be working with their intended design and functionality. The status of other screens (marked as ✅ Design Complete) refers to the completion of their visual design blueprints, not their implemented and functional status in the game engine.



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
Heal the player, open inventory, or save progress; option to proceed to next random event/floor.


Game Over
screens/game-over.html
✅ Design Complete
View run statistics, retry from checkpoint, or return to the main menu.


Dynamic UI Element Updates:The game dynamically updates UI elements (like HP/resource bars, stat displays) using core functions. Key functions responsible for this include:

game.js:setScreen(screenId): Centralized function for loading screen HTML/CSS/JS and managing visibility.
js/screens/battle.js:updateBattleUI(): Handles the overall refreshing of player and enemy panels during combat (placeholder, to be implemented in screen-specific JS).
game.js:updateBar(barId, current, max): Updates the visual fill percentage of progress bars (e.g., HP, Mana).
game.js:updateElement(id, value): Updates the text content of specific HTML elements by ID.

🌍 HUD & Global UI Behavior
This section defines the behavior of persistent, global UI elements.

Global Elements: The top bar containing Floor Number, Gold Count, and the Inventory button is a global element, managed by game.js:setScreen.
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
Activation: Active only when DEBUG_MODE = true.
Code Files: Primarily js/debug.js, activated by js/main.js.
Debug Panel: Implemented in index.html with a structure including a header, game state section (debug-content), and console log section (debug-log-content), with buttons for copying logs (debug-copy-btn) and closing (debug-close-btn).
Advanced Features (v36.6):
Overhauled into an advanced, standalone tool.
Implements global window.onerror and unhandledrejection handlers to catch all runtime exceptions and promise rejections with full stack traces.
Rewrites console interception to intelligently format and display objects/arrays as interactive, collapsible trees.
Includes a "Copy All Logs" button for easy, one-click bug reporting.
Updated the debug panel UI in index.html to support the new features.



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
Ability Unlocks: Abilities unlock at Level 1, 5, 10, 15.
Stats: HP, ATK, DEF, SPD, Crit.

⚔️ Combat System

Turn-based: Initiative is determined by SPD (Speed) stat.
Actions: Players can choose from Attack, Skill, Defend, or Flee.
Critical Hits: Crit chance is currently 10–20%.
Status Effects (planned): Poison, Burn, Freeze, Stun, Shield, Regen.
Elemental Wheel (planned): Fire > Ice > Nature > Shadow > Fire.
UI: Dynamically loaded and managed by js/screens/battle.js, in conjunction with screens/battle.html and css/battle.css.
Dynamic Difficulty & Rewards Scaling: The game incorporates dynamic scaling to ensure challenge. Enemy stats (HP, Attack, Defense, Speed) will increase with higher floor numbers. Similarly, XP and gold rewards from enemies will scale up to match the increased difficulty. This scaling is derived from GameConfig.DIFFICULTIES multipliers.

🎒 Inventory, Loot & Potions

Slots: Head, Shoulders, Chest, Legs, Feet, Hands, Weapon, Accessory.
Item Naming Convention: Items follow a clear naming convention.
Formula: [Prefix] [Base Item Name] [Suffix/Affix]
Prefixes/Affixes: A set of pre-saved options/variables will be used to create prefixes and affixes. Higher rarity gear will have special affixes or prefixes.
Example: "of the Wolf" could be a suffix for rare items.


Loot Drop Rules:
Enemies: Every non-boss enemy is guaranteed to drop a loot item upon defeat. This drop is not always gear but can include other items like potions or gold.
Rarity: The item's rarity (Common, Uncommon, Rare, etc.) is determined by weighted percentages (e.g., Common: 50%, Rare: 15%, Legendary: 0.2%). These formulas are flexible for balancing and difficulty adjustments.
Bosses: Bosses drop a selection of major, higher-quality loot.
Item Formula: (ATK + DEF + bonus) × multiplier + affinity


Potions & Consumables:
Types: Players can find and use various consumables, including:
HP Potion: Restores health.
Resource Potion (Elixir): Restores a primary resource (Vigor, Mana, Energy).
Antidote: Cures negative status effects like poison.


Acquisition: These items can be found as loot, purchased from Shops, or awarded at Shrines.
Usage: Using a consumable during combat counts as a player's turn.
Item Level: Always shown on hover for player convenience.



⚙️ Architecture & File Structure
This outlines the planned file architecture for the project. Note that while the guide provides a detailed structure, root files (except index.html), and non-core CSS/JS files are subject to change names or locations without direct updates in this guide, as long as the overall modularity and functionality are maintained.
path-of-heroes-rpg/
├── .gitignore
├── index.html  # Entry point, orchestrates screen loading
├── assets/
│   ├── audio/
│   ├── images/
│   └── videos/
├── css/
│   ├── main.css  # Shared styles (e.g., Dark RPG Palette, global HUD)
│   ├── intro.css
│   ├── character-select.css
│   ├── battle.css
│   ├── shop.css
│   ├── shrine.css
│   ├── campfire.css
│   ├── game-over.css
│   └── inventory.css
├── js/
│   ├── main.js  # Core game logic, state management
│   ├── debug.js
│   ├── screens/
│   │   ├── intro.js
│   │   ├── character-select.js
│   │   ├── battle.js
│   │   ├── shop.js
│   │   ├── shrine.js
│   │   ├── campfire.js
│   │   └── game-over.js
│   ├── core/
│   │   ├── config.js
│   │   ├── game.js
│   │   ├── localization.js
│   │   └── state.js
│   └── systems/
│       ├── combat.js
│       └── inventory.js
├── screens/
│   ├── intro.html
│   ├── character-select.html  # Replaces designs/newcharacters.html
│   ├── battle.html
│   ├── shop.html
│   ├── shrine.html
│   ├── campfire.html
│   └── game-over.html
└── designs/  # Legacy mockups/prototypes
    ├── battle.png
    ├── battlescreen.html
    ├── campfire.html
    ├── designs.html
    ├── gameoverdesign.html
    ├── newcharacters.html
    ├── shop.html
    ├── shrine.html
    ├── split_code.bat
    ├── temp.html
    └── victory.html

⚙️ Technical Overview
This section outlines the foundational technical aspects and core responsibilities of the PathOfHeroes game class.

Main Game Class (PathOfHeroes): The central class that orchestrates the entire game. It manages overall state, screen transitions, and coordinates interactions between different game systems.
Initialization (init()): The entry point for starting the game. It initializes core systems (localization, state, combat, inventory), sets up global event listeners, and begins the loading sequence. Critical errors during initialization will alert the user and halt the game.
System Initialization (initializeSystems()): Responsible for instantiating and initializing key game modules like Localization, GameState, CombatSystem, and InventorySystem.
Event Listeners (setupEventListeners()): Binds essential global event listeners, such as keyboard input for debugging or game controls, and click listeners for the debug panel.
Loading Sequence (startLoadingSequence()): Manages the initial loading progression of the game, displaying a progress bar before transitioning to the Main Menu.
Method Binding (bindMethods()): Crucial for ensuring that class methods maintain their this context when used as event listeners or callbacks.
Core Systems:
Localization: Handles dynamic language switching for all in-game text (English/Arabic).
GameState: Manages the current state of the game, including active screen, player data, current floor, gold, inventory, and battle status.
CombatSystem: Orchestrates turn-based combat logic.
InventorySystem: Manages player inventory, including adding, equipping, using, sorting, and selling items.



📝 Design Recovery & Progress Tracking
Issue: The Battle Screen UI implementation has encountered significant issues, resulting in lost progress and an inability to locate a previously working version.
Strategy for Recovery and Future Development:

Re-conceptualize/Re-design if necessary: If the existing screens/battle.html proves too difficult to implement robustly or has inherent flaws, we will revisit its core concept.
Mockups First (Strict Adherence): Before any new code is integrated into the core codebase, a standalone HTML mockup (with dummy logs) for the screen or feature must be created and fully tested in the designs/ folder before moving to screens/. This will focus solely on visual layout and intended interactions.
Simulate Execution Internally: AI developers should internally simulate browser execution and debug mockups thoroughly before proposing integration into the main codebase.
Incremental Commits: Break down complex UI implementations into smaller, manageable commits. Each commit should be accompanied by a clear description and Jump Codes.
Versioned Design Backups: Ensure all approved design mockups are consistently versioned and backed up, perhaps with explicit 'stable' checkpoints for crucial screens.
Regular Communication: Explicitly flag any implementation challenges or significant deviations from design during development for discussion and collaborative problem-solving.

🛠️ Development & Version Control
Rules for AI or Human Devs:

Use mockups first (standalone HTML with dummy logs) for new screens or significant UI changes.
Simulate browser execution internally and debug before sending code.
Add Jump Code headers (e.g., // game.js, jump-V.36.6-1) above relevant code blocks in the markdown response for easy navigation. Do not place Jump Codes within the actual code file content.
Never overwrite README.md sections — always append updates to the changelog at the bottom.
When providing new/changed HTML, ensure only the formatting portion is considered, not any programming logic.
Git Branch Management: The repository may use either main or master as the primary branch (check git branch -r for origin/main or origin/master). Ensure local branches are synced with the remote repository using git pull or git push to avoid conflicts.
Commit Format: All commit messages must follow a strict two-part structure: Title (with version prefix) and Body.

The "Jump Code" Navigation RulePurpose: To make navigating long responses with multiple files easy and reliable using the browser's "Find" feature.
How it Works:

At the top of every response containing code, provide a File Index.
Next to each file (and the commit message), include a unique Jump Code.
The format is always jump-VERSION-IDENTIFIER:
e.g., jump-V.2.0.1-1 for the first file.
jump-V.2.0.1-2 for the second file.
jump-V.2.0.1-C for the commit message block.



Example:
### 📋 File Index (Use Ctrl+F to find a Jump Code)
* `js/core/game.js` --- (Jump Code: **jump-V.2.1.0-1**)
* `css/main.css` -------- (Jump Code: **jump-V.2.1.0-2**)
* GitHub Commit Suggestion -> (Jump Code: **jump-V.2.1.0-C**)

### jump-V.2.1.0-1 - File: js/core/game.js
```javascript
// This is the content of game.js
console.log("Game initialized!");

jump-V.2.1.0-2 - File: css/main.css
/* This is the content of main.css */
body { margin: 0; }

jump-V.2.1.0-C - GitHub Commit Suggestion
... (commit message) ...

To use it: Copy the Jump Code (e.g., `jump-V.2.1.0-1`), press `Ctrl+F` (or `Cmd+F` on Mac), paste the code, and the browser will jump directly to that section.

**The Commit Message Rule**  
**Purpose**: To keep project history clean, professional, and easy to understand.

**The Format**: Commit messages have two parts: a Title (with version prefix), and a Body. In VS Code's single message box, the first line is the Title. After one blank line, the rest is the Body.

- **Title**: A version-prefixed short summary of the change.
  - **Format**: `Version: V.X.X.X - type(scope): subject`
  - **Type examples**: `feat` (new feature), `fix` (bug fix), `refactor`, `style`, `docs`, `chore`.
  - **Scope examples**: `ui`, `core`, `battle`, `inventory`, `project`.
- **Body**: (Optional but preferred) A brief paragraph explaining what the change is and why it was made.

**Example**:  

Version: V.2.0.1 - fix(ui): Correct battle screen layout
Refactors the player stats panel to a single-column layout for better readability. Also adds padding to the main container to resolve an overlap with the language selector.

## ✅ Log of Major Historical Updates
- **v30 - v31**: Initial project setup, scope definition, and core mechanics established.
- **v32**: Overhauled UI/UX with new screen designs for Character Selection, Dungeon Map, Shop, Shrine, Campfire, and Game Over.
- **v32.1**: Added formal Version Control and AI Collaboration rules.
- **v32.2**: Added the UI & Screen Design Blueprints table to the guide.
- **v32.3**: Reorganized project structure to place all design mockups in a dedicated `/designs` folder. Updated guide to reflect new paths.
- **v32.4**: Added the "Static Layouts" master rule to ensure UI dimensions do not change when switching languages.
- **v32.5**: Finalized the battle screen design. Established new rules for the global UI (Floor/Gold/Inventory display). Updated and clarified loot drop and potion/elixir systems.
- **v32.6 - v32.8**: Implemented the Global HUD, refactored the Character Selection and Battle screens, and implemented the guaranteed loot drop system.
- **v32.9**: Consolidated all project information into a single, authoritative `README.md` file. This file was intended as the single source of truth, with all future changes tracked via Git commits.
- **v36.5 – July 13, 2025**:
  - Updated death penalty to "respawn at respawn point which is 1,5,10,15,20, etc."
  - Changed architecture folder name to `path-of-heroes-rpg/`.
  - Updated `README.md` rule: all updates must be appended, not overwritten. Include code excerpts where necessary.
  - Reworded and finalized documentation formatting for AI compatibility and future-proofing.
- **v36.6 – July 13, 2025**:
  - `feat(dev)`: Overhauled the debugger system into an advanced, standalone tool.
  - Implemented global `window.onerror` and `unhandledrejection` handlers to catch all runtime exceptions and promise rejections with full stack traces.
  - Rewrote console interception to intelligently format and display objects/arrays as interactive, collapsible trees.
  - Added a "Copy All Logs" button for easy, one-click bug reporting.
  - Updated the debug panel UI in `index.html` to support the new features.
  - `docs(readme)`: Added a Jump Code Index section to track all versioned code changes for easy navigation.
- **v36.9 – July 14, 2025**:
  - `docs(readme)`: Added new Technical Overview section to detail game initialization and core systems.
  - `docs(readme)`: Corrected and expanded Game Overview to include full 6-biome structure.
  - `docs(readme)`: Added Dynamic UI Element Updates under UI & Screen Design Blueprints.
  - `docs(readme)`: Refined Core Gameplay Loop to remove "Continue to Floor X?" prompt, making Campfire the strategic progression point.
  - `docs(readme)`: Added Dynamic Difficulty & Rewards Scaling under Combat System.
  - `docs(readme)`: Updated HUD & Global UI Behavior to clarify inventory restrictions during battle.
  - `docs(readme)`: Removed all references to Konami Code functionality.
- **v37.0 – July 14, 2025**:
  - `docs(readme)`: Corrected language from Italian to English in sections (Debugger System, Playable Characters, Combat System, Inventory) to match the project's primary language (English with Arabic in-game support).
  - `docs(readme)`: Introduced a new `/screens` folder for dedicated HTML files per screen (`intro.html`, `character-select.html`, etc.). Added corresponding screen-specific CSS and JS files under `/css` and `/js`. Kept `/designs` for legacy mockups.
- **v37.1 – July 15, 2025**:
  - `docs(readme)`: Updated Current Status to clarify Battle screen UI and functionality are under active refactor.
  - `docs(readme)`: Added `js/screens/` subfolder for screen-specific JS files (e.g., `battle.js`, `intro.js`).
  - `docs(readme)`: Updated Game Overview to include "component-based structure" and "screen HTML loaded dynamically."
  - `docs(readme)`: Added `game.js:setScreen` and `js/screens/battle.js:updateBattleUI` (placeholder) to Dynamic UI Element Updates.
  - `docs(readme)`: Noted in HUD & Global UI Behavior that global elements are managed by `game.js:setScreen`.
  - `docs(readme)`: Updated Combat System to specify UI is dynamically loaded by `js/screens/battle.js`, `screens/battle.html`, and `css/battle.css`.
  - `docs(readme)`: Added v37.1 Jump Code Index entries for `index.html`, `js/main.js`, `js/core/game.js`, `js/systems/combat.js`, `screens/battle.html`, and `js/screens/battle.js`.

## 🔄 Track Changes (from v37.2 to v37.3)
This section details the specific changes made to update the README from v37.2 to v37.3, addressing formatting issues, missing features, and incorporating updates from an alternative source.

- **Version Number Update**: The overall README version updated from `v37.2` to `v37.3`.
- **Language Scope Clarification**:
  - **Previous**: v37.0 inadvertently included Italian in some sections due to a translation error. v37.1 and v37.2 corrected this but needed to confirm the project’s bilingual scope.
  - **Change**: Explicitly stated in Game Overview that documentation is in English only, with in-game text supporting English/Arabic. Ensured all sections are in English.
  - **Reason**: Reinforces that the project is bilingual (English/Arabic) for in-game text, with documentation strictly in English to avoid confusion.
- **"Architecture & File Structure" Formatting**:
  - **Previous**: File tree was formatted but could be clearer with proper indentation and code fences.
  - **Change**: Reformatted file tree using `plaintext` code fences with consistent indentation for clarity.
  - **Reason**: Improves readability and aligns with Markdown best practices.
- **"Debugger System" Update**:
  - **Previous**: Described advanced features but lacked specific debug panel structure.
  - **Change**: Added Debug Panel subsection with HTML structure details (e.g., `debug-panel`, `debug-content`, `debug-copy-btn`) from `index.html`.
  - **Reason**: Ensures completeness of debugger documentation, addressing missing details from prior versions.
- **"Development & Version Control" Update**:
  - **Previous**: Lacked Git branch management guidance.
  - **Change**: Added Git Branch Management rule to note `main` or `master` branches and syncing with `git pull`/`push`.
  - **Reason**: Addresses prior repository syncing issues (e.g., master/main confusion) for robust version control.
- **"Track Changes" Update**:
  - **Previous**: v37.2 changelog was comprehensive but needed to merge alternative v36.6 entries and clarify missing features.
  - **Change**: Merged alternative v36.6 entries, retained v37.1 updates, and added debug panel and Git branch details.
  - **Reason**: Ensures all historical updates are captured, addressing concerns about missing details.
