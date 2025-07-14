Understood. Based on our detailed discussion and your approvals, I will now create two distinct outputs:

The updated and refined README.md (v37.0), with the removed sections and integrated changes.

The updated Master GPT Prompt (v1.1), containing the AI-specific directives.

This ensures a clean separation of project documentation and AI operational instructions.

Path of Heroes – Master README (v37.0)
Last Updated: July 14, 2025

GitHub Repository: https://github.com/thewahish/path-of-heroes-rpg

Current Status: In progress (~75% complete). Game engine loads with console warnings handled via safe listeners (e.g., missing IDs warn but don't crash). Debugger active with real-time state and console capture. Battle starts but UI is placeholder (implementation needs revisiting per design due to lost progress). Inventory functional (equip/use/sort/sell). Char select updated to v3 layout. Prioritize: Implement random events loop, full battle UI, shrines/shops/campfire integration. All code adheres to overrides (10-floor demo, random events, no map).

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

Track Changes (from v36.9 to v37.0)

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


Export to Sheets
🎮 Game Overview
Title: Path of Heroes / طريق الأبطال
Genre: 2D top-down, turn-based roguelike dungeon crawler (inspired by Hades, Dead Cells, Slay the Spire, Diablo).
Platform: Mobile-only web game (HTML/CSS/JS), PWA-ready for Android/iOS.
Orientation: Strictly portrait mode on all screens (fits tablets with centered content; preferably no black bars unless needed and unless it won't change the whole design and make it offset).
Technology: Multi-file structure with index.html as entry point, modular JS/CSS in subfolders; mockups generated as standalone single HTML files for testing without breaking the main codebase.
Languages: Fully bilingual (English/Arabic) with dynamic RTL switching.
Visual Style: Dark fantasy with Arabic/English fusion, high contrast, low saturation, glowing effects for rare items.
Input: Touch-only with on-screen buttons and gestures.
Scope: The demo is only 10 floors. Each Biome is 10 floors. There's only one boss per demo, then a demo completion message. The full game is 60 levels, structured across 6 biomes as follows:

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


Export to Sheets
The level cap for the demo is 10, corresponding to the single "Ancient Ruins" biome.

🎨 UI/UX Design Principles & Rules
Golden Rules:

Portrait-Only: All screens are designed and optimized exclusively for portrait orientation. No landscape support will be implemented.

Static Layouts (Fixed Size Elements): All UI elements, including containers, boxes, buttons, and text elements, must have static, fixed dimensions. These dimensions should be calculated to accommodate the longest possible text strings across all supported languages (English and Arabic), and for the largest possible font types/sizes, without causing the element to resize or shift the layout. Text within these elements should be centered to handle varying string lengths gracefully. This ensures UI consistency regardless of content.

No Scrolling: UI layouts must fit within a standard mobile viewport without requiring vertical scrolling.

Note: The shop.html design includes a scrollable item grid (overflow-y: auto). This must be reviewed and potentially refactored into a paginated view to adhere to this rule.

Safe Zones: All interactive UI elements should be contained within 80-95% of the screen area to ensure accessibility and prevent accidental taps on all devices.

No Redundant Globals: Global controls like the language toggle are part of the main game shell and should not be re-implemented or redesigned within individual screen mockups.

Mobile-First Sizing: max-width: 480px

Dark RPG Palette:

Background: radial-gradient(ellipse at center, #1a0f0a 0%, #0d0604 40%, #000000 100%)

Shrine BG: assets/bg_shrine_dark_forest.jpg

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
This section serves as the official registry for all UI design mockups. The blueprint files are the visual and functional source of truth and are stored in the designs/ directory of the project.

Important Note: Only the "Intro" and "Character Selection" screens are currently confirmed to be working with their intended design and functionality. The status of other screens (marked as ✅ Design Complete) refers to the completion of their visual design blueprints, not their implemented and functional status in the game engine.

Screen/Feature

Design Blueprint File

Status

Key Functionality

Character Selection

designs/newcharacters.html

✅ Working (Design & Functionality)

Select hero via tabs, view stats, start a new run.

Intro Screen

(No dedicated file specified, implied by game start)

✅ Working (Design & Functionality)

Initial game entry point.

Battle Screen

designs/battle.html

✅ Design Complete

Engage in turn-based combat, use skills and items.

Shop / Merchant

designs/shop.html

✅ Design Complete

View gold, browse items for sale, buy items.

Shrine

designs/shrine.html

✅ Design Complete

Choose one of three powerful blessings.

Campfire

designs/campfire.html

✅ Design Complete

Heal the player, open inventory, or save progress.

Game Over

designs/gameoverdesign.html

✅ Design Complete

View run statistics, retry from checkpoint, or return to the main menu.


Export to Sheets
Dynamic UI Element Updates:
The game dynamically updates UI elements (like HP/resource bars, stat displays) using core functions. Key functions responsible for this include:

updateBattleDisplay(): Handles the overall refreshing of player and enemy panels during combat.

updateBar(barId, current, max): Updates the visual fill percentage of progress bars (e.g., HP, Mana).

updateElement(id, value): Updates the text content of specific HTML elements by ID.

🌍 HUD & Global UI Behavior
This section defines the behavior of persistent, global UI elements.

Global Elements: The top bar containing Floor Number, Gold Count, and the Inventory button is a global element.

Visibility Rule: These global elements should only be visible on screens that appear after Character Selection (e.g., in encounters, shops). They must not appear on the Main Menu or Character Selection screens.

Language Toggle: The language toggle button is a global component with a fixed position throughout the entire application and is not considered part of any specific screen's content area.

Inventory Button Behavior: The inventory button expands/minimizes on tap.

In Battle: When in battle, the inventory can be viewed, but equipping or using items (including weapon swapping) will not be allowed. Closing the inventory will return the player to the active battle.

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

Encouragement Messages: Every time the player dies, one of 20 pre-saved bilingual messages will be displayed to encourage them.

Demo Completion: After defeating the Floor 10 boss, a modal will appear: “You have beaten the demo! Please purchase the full game at https://pathofheroes.com/buy.”

🐛 Debugger System
Toggle: Activated via a 🐛 icon at the bottom-left of the screen.

Functionality: Shows real-time game state, and logs.

Activation: Active only when DEBUG_MODE = true.

Code Files: Primarily js/debug.js, activated by main.js.

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


Export to Sheets
Level Cap: 10 for the demo, 60 for the full game.

Ability Unlocks: Abilities unlock at Level 1, 5, 10, 15.

Stats: HP, ATK, DEF, SPD, Crit.

⚔️ Combat System
Turn-based: Initiative is determined by SPD (Speed) stat.

Actions: Players can choose from Attack, Skill, Defend, or Flee.

Critical Hits: Crit chance is currently 10–20%.

Status Effects (planned): Poison, Burn, Freeze, Stun, Shield, Regen.

Elemental Wheel (planned): Fire > Ice > Nature > Shadow > Fire.

UI: Implemented per designs/battle.html.

Dynamic Difficulty & Rewards Scaling:
The game incorporates dynamic scaling to ensure challenge. Enemy stats (HP, Attack, Defense, Speed) will increase with higher floor numbers. Similarly, XP and gold rewards from enemies will scale up to match the increased difficulty. This scaling is derived from GameConfig.DIFFICULTIES multipliers.

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
├─ .gitignore
├─ index.html
│
├───assets/
│ ├─ audio/
│ ├─ images/
│ ├─ videos/
│ └─ bg_shrine_dark_forest.jpg
│
├───css/
│ ├─ battle.css
│ ├─ inventory.css
│ └─ main.css
│
├───designs/
│ ├─ battle.png
│ ├─ battlescreen.html
│ ├─ campfire.html
│ ├─ designs.html
│ ├─ gameoverdesign.html
│ ├─ newcharacters.html
│ ├─ shop.html
│ ├─ shrine.html
│ ├─ split_code.bat
│ ├─ temp.html
│ └─ victory.html
│
└───js/
  ├─ debug.js
  ├─ main.js
  ├───core/
  │ ├─ config.js
  │ ├─ game.js
  │ ├─ localization.js
  │ └─ state.js
  └───systems/
    ├─ combat.js
    └─ inventory.js
⚙️ Technical Overview
This section outlines the foundational technical aspects and core responsibilities of the PathOfHeroes game class.

Main Game Class (PathOfHeroes): The central class that orchestrates the entire game. It manages overall state, screen transitions, and coordinates interactions between different game systems.

Initialization (init()): The entry point for starting the game. It initializes core systems (localization, state, combat, inventory), sets up global event listeners, and begins the loading sequence. Critical errors during initialization will alert the user and halt the game.

System Initialization (initializeSystems()): Responsible for instantiating and initializing key game modules like Localization, GameState, CombatSystem, and InventorySystem.

Event Listeners (setupEventListeners()): Binds essential global event listeners, such as keyboard input for debugging or game controls, and click listeners for the debug panel.

Loading Sequence (startLoadingSequence()): Manages the initial loading progression of the game, displaying a progress bar before transitioning to the Main Menu.

Method Binding (bindMethods()): Crucial for ensuring that class methods maintain their this context when used as event listeners or callbacks.

Core Systems:

Localization: Handles dynamic language switching for all in-game text.

GameState: Manages the current state of the game, including active screen, player data, current floor, gold, inventory, and battle status.

CombatSystem: Orchestrates turn-based combat logic.

InventorySystem: Manages player inventory, including adding, equipping, using, sorting, and selling items.

📝 Design Recovery & Progress Tracking
Issue: The Battle Screen UI implementation has encountered significant issues, resulting in lost progress and an inability to locate a previously working version.

Strategy for Recovery and Future Development:
To prevent similar setbacks and ensure robust progress, we will adopt the following approach:

Re-conceptualize/Re-design if necessary: If the existing designs/battle.html proves too difficult to implement robustly or has inherent flaws, we will revisit its core concept.

Mockups First (Strict Adherence): Before any new code is integrated into the core codebase, a standalone HTML mockup (with dummy logs) for the screen or feature must be created and fully tested. This will focus solely on visual layout and intended interactions.

Incremental Commits: Break down complex UI implementations into smaller, manageable commits. Each commit should be accompanied by a clear description and Jump Codes.

Versioned Design Backups: Ensure all approved design mockups are consistently versioned and backed up, perhaps with explicit 'stable' checkpoints for crucial screens.

Regular Communication: Explicitly flag any implementation challenges or significant deviations from design during development for discussion and collaborative problem-solving.

🛠️ Development & Version Control
Rules for AI or Human Devs:

Use mockups first (standalone HTML with dummy logs) for new screens or significant UI changes.

Commit Format: All commit messages must follow a strict three-part structure: Title, Body, and Footer.

The Commit Message Rule

Purpose: To keep our project history clean, professional, and easy to understand.

The Format:
Our commit messages have three parts: a Title, a Body, and a Footer. In VS Code's single message box, the first line is the Title. After one blank line, the rest of the text is the Body and Footer.

Title: A short summary of the change.

Format: Version: V.X.X.X - type(scope): subject

type examples: feat (new feature), fix (bug fix), refactor, style, docs, chore.

scope examples: ui, core, battle, inventory, project.

Body: (Optional but preferred) A brief paragraph explaining what the change is and why it was made.

Footer: A single line at the very end for any additional versioning or related notes.

Example:

Version: V.2.0.1 - fix(ui): Correct battle screen layout

Refactors the player stats panel to a single-column layout for better readability. Also adds padding to the main container to resolve an overlap with the language selector.
✅ Log of Major Historical Updates
v30 - v31: Initial project setup, scope definition, and core mechanics established.

v32: Overhauled UI/UX with new screen designs for Character Selection, Dungeon Map, Shop, Shrine, Campfire, and Game Over.

v32.1: Added formal Version Control and AI Collaboration rules.

v32.2: Added the UI & Screen Design Blueprints table to the guide.

v32.3: Reorganized project structure to place all design mockups in a dedicated /designs folder. Updated guide to reflect new paths.

v32.4: Added the "Static Layouts" master rule to ensure UI dimensions do not change when switching languages.

v32.5: Finalized the battle screen design. Established new rules for the global UI (Floor/Gold/Inventory display). Updated and clarified loot drop and potion/elixir systems.

v32.6 - v32.8: Implemented the Global HUD, refactored the Character Selection and Battle screens, and implemented the guaranteed loot drop system.

v32.9: Consolidated all project information into a single, authoritative README.md file. This file was intended as the single source of truth, with all future changes tracked via Git commits.

v36.5 – July 13, 2025:

Updated death penalty to "respawn at respawn point which is 1,5,10,15,20, etc."

Changed architecture folder name to path-of-heroes-rpg/.

Updated README.md rule: all updates must be appended, not overwritten. Include code excerpts where necessary.

Reworded and finalized documentation formatting for AI compatibility and future-proofing.

v36.6 – July 13, 2025:

feat(dev): Overhauled the debugger system into an advanced, standalone tool.

Implemented global window.onerror and unhandledrejection handlers to catch all runtime exceptions and promise rejections with full stack traces.

Rewrote console interception to intelligently format and display objects/arrays as interactive, collapsible trees.

Added a "Copy All Logs" button for easy, one-click bug reporting.

Updated the debug panel UI in index.html to support the new features.

docs(readme): Added a Jump Code Index section to track all versioned code changes for easy navigation.

🔄 Track Changes (from v36.9 to v37.0)
This section details the specific changes made to update the README from v36.9 to v37.0, reflecting the split of responsibilities between the README.md and the Master GPT Prompt.

Version Number Update: The overall README version updated from v36.9 to v37.0.

Removed AI-Specific Rules from "Development & Version Control":

The "Jump Code" Navigation Rule section was removed from README.md as it now resides solely in the Master GPT Prompt.

The following AI-specific operational rules were removed from the "Rules for AI or Human Devs" bullet points, as they are now directives in the Master GPT Prompt:

"Simulate browser execution internally and debug before sending code."

"Add Jump Code headers... above relevant code blocks... Do not place Jump Codes within the actual code file content."

"Never overwrite README.md sections — always append updates to the changelog at the bottom."

"When providing new/changed HTML, ensure only the formatting portion is considered, not any programming logic."

Master GPT Prompt Reference: The Master GPT Prompt is now the explicit location for AI interaction protocols, ensuring clarity for new AI sessions.

"Game Overview" - Scope Biomes and Bosses: Ensured the detailed 6-biome structure for the full game is fully and correctly presented in a table format. (This was a correction from a previous oversight, but re-confirmed its presence here.)

Other content: All other sections and details from v36.9 (UI/UX principles, Blueprints, HUD, Gameplay Loop, Debugger, Characters, Combat, Inventory, Architecture, Technical Overview, Design Recovery, Commit Message Rule, Log of Updates) were retained as they pertain to the project itself.

🧠 Master GPT Prompt (v1.1)
Version: v1.1

You are the Lead Developer, Game Designer, Debugger, and Technical Architect for the mobile-only game "Path of Heroes" (HTML/CSS/JS-based 2D roguelike dungeon crawler). You operate as a cohesive team to handle all aspects of development, ensuring alignment with the project's vision and technical requirements.

Project Context:

Game Name: Path of Heroes

Genre: 2D Roguelike Dungeon Crawler

Platform/Tech Stack: Mobile-only (HTML/CSS/JS-based)

Core Directives:

Source of Truth:

Use the README.md file as the sole source of truth for all project structure, logic, design, and versioning.

If not already provided by the user, immediately ask for the latest copy of README.md. Do not proceed until it is loaded and the scope is confirmed.

If resuming an existing project, ask the user to provide the complete content of all relevant project files (e.g., index.html, style.css, script.js, game.js, player.js, dungeon.js, etc.) for the current version. Do not accept diffs unless specifically requesting them for a small, isolated change.

Task Focus & Prioritization:

For any new feature, bug fix, refactoring, or code block, require the user to explicitly state:

Their preferred task to focus on right now (as specific as possible).

Any relevant context, design ideas, or constraints for this task.

At the start of each interaction, ask the user: What is the single most important task you want me to focus on in this interaction?

Design & Asset Integration:

If proposing design concepts or mockups (e.g., for UI elements, character sprites, tile sets, level layouts), ask for the user's confirmation before integrating them into the core code.

For visual or audio assets, ask the user to specify if they will provide them (e.g., image URLs, SVG code, sound files) or if you should generate placeholder assets (e.g., using SVG/Emoji descriptions for visuals, or simple Tone.js sounds for audio).

Code Generation & Debugging Protocol:

Pre-delivery Debugging: Simulate execution and debug the code internally before providing it. Your goal is to deliver runnable, error-free code.

Output Format: Provide all code within <immersive type="code"> tags. Use conversational text format for explanations, discussions, and project updates.

File Naming: Include the file name at the top of all code blocks in the markdown response (e.g., // filename.js).

HTML Generation Constraint: When providing new/changed HTML, ensure only the formatting portion is considered, not any programming logic.

README Updates Protocol:

Never replace existing sections of the README.md unless explicitly handling a change to core logic or the source of truth (see "Source of Truth Changes Rule" below).

For standard updates (new features, modifications, design decisions), append all changes to the changelog section at the bottom of the README.md.

Version Control & Tracking Changes:

Track all changes using semantic versioning (e.g., V.X.Y.Z, where X is major, Y is minor, Z is patch). Increment versions appropriately for each update (e.g., major for breaking changes, minor for new features, patch for fixes).

For every response that includes code changes, provide a GitHub Commit Suggestion at the end, formatted as per "The Commit Message Rule" in the Development & Version Control section of README.md.

Use "The Jump Code" Navigation Rule (defined below) in every response containing code to enable easy navigation.

The "Jump Code" Navigation Rule:

Purpose: To make navigating long responses with multiple files easy and reliable using the user's browser's "Find" feature.

How it Works: At the top of every response containing code, you will provide a File Index. Next to each file (and the commit message), there will be a unique Jump Code. The format is always jump-VERSION-IDENTIFIER:

jump-V.2.0.1-1 for the first file.

jump-V.2.0.1-2 for the second file.

jump-V.2.0.1-C for the commit message block.

Example:

Markdown

### 📋 File Index (Use Ctrl+F to find a Jump Code)
* `js/core/game.js` --- (Jump Code: **jump-V.2.1.0-1**)
* `css/main.css` -------- (Jump Code: **jump-V.2.1.0-2**)
* GitHub Commit Suggestion -> (Jump Code: **jump-V.2.1.0-C**)

---
### jump-V.2.1.0-1 - File: js/core/game.js
```javascript
// This is the content of game.js
console.log("Game initialized!");
jump-V.2.1.0-2 - File: css/main.css
CSS

/* This is the content of main.css */
body { margin: 0; }
jump-V.2.1.0-C - GitHub Commit Suggestion
... (commit message) ...


Progress Safeguard Rule:

To prevent loss of progress (e.g., as in a scenario where a UI refactor breaks the battle screen layout without an easy revert), treat every interaction as a versioned checkpoint.

In responses with changes: (1) Include a diff summary for review; (2) Provide an optional "Archive Snapshot" of previous key files if the change is high-risk; (3) For recovery, if the user reports an issue, require them to specify the last working version and confirm before reverting—never assume or start from scratch without explicit instruction. Encourage the user to save versions locally via Git for redundancy.

Source of Truth Changes Rule:

If a task involves changing core logic, project structure, design principles, or any aspect of the source of truth in README.md (e.g., updating rules, directives, or foundational descriptions), first ask the user for explicit confirmation.

If confirmed, recreate the entire README.md file with the replaced/updated sections integrated seamlessly as the new master version (becoming the definitive source of truth). Do not create confusing parallel versions; instead, document the changes in extreme detail within the changelog section at the bottom, including: what the old content was (e.g., "Previously, the rule for X was ABC, specifying [full old text]"), why it was changed, and what the new content is (e.g., "Now updated to DEF, specifying [full new text]"). This ensures traceability without fragmenting the active source of truth.

Communication & Iteration:

Clarity: Expect clear, atomic instructions from the user. If ambiguous, ask for clarification.

Bug Reporting: If the user reports issues with generated code or game functionality, require them to describe the problem in detail, including steps to reproduce, expected behavior, and actual behavior.

Iterative Development: Work iteratively. Offer small adjustments and seek clarification as needed.
