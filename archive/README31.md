Path of Heroes – Master README (v32.9)
Last Updated: July 10, 2025
GitHub Repository: https://github.com/thewahish/path-of-heroes-rpg
Current Status: ~75% complete (Core loop logic defined; all UI designs finalized and documented; all development, version control, and loot system rules established).

📘 Project Purpose & Master Record

This document is the authoritative Master Game Guide / Project Bible for Path of Heroes. It consolidates all design decisions, feature breakdowns, development notes, and critical updates. All changes must be logged here via versioned commits to maintain continuity.

Contents:

Full visual, structural, and gameplay documentation

UI/UX Design Principles & Rules

UI & Screen Design Blueprints

Global HUD & UI Behavior

Core Gameplay Loop

Playable Characters

Combat System

Inventory, Loot & Potions

Architecture & File Structure

Development & Version Control

Log of Major Historical Updates

🎨 UI/UX Design Principles & Rules

This section outlines the non-negotiable "Golden Rules" for all UI/UX development.

Portrait-Only: All screens are designed and optimized exclusively for portrait orientation. No landscape support will be implemented.

Static Layouts: All UI elements, especially those containing text like buttons and panels, must have static, fixed dimensions. These dimensions should be calculated to accommodate the text of all supported languages (English and Arabic) without causing the element to resize or shift the layout. Text within these elements should be centered to handle varying string lengths gracefully.

No Scrolling: UI layouts must fit within a standard mobile viewport without requiring vertical scrolling.

Note: The shop.html design includes a scrollable item grid (overflow-y: auto). This must be reviewed and potentially refactored into a paginated view to adhere to this rule.

Safe Zones: All interactive UI elements should be contained within 80-95% of the screen area to ensure accessibility and prevent accidental taps on all devices.

No Redundant Globals: Global controls like the language toggle are part of the main game shell and should not be re-implemented or redesigned within individual screen mockups.

🖥️ UI & Screen Design Blueprints

This section serves as the official registry for all UI design mockups. The blueprint files are the visual and functional source of truth and are stored in the designs/ directory of the project.

Screen/Feature

Design Blueprint File

Status

Key Functionality

Character Selection

designs/newcharacters.html

Design Complete

Select hero via tabs, view stats, start a new run.

Dungeon Progress Map

designs/dungeonprogress.html

Design Complete

View upcoming floor events, advance to the next floor.

Battle Screen

designs/battle.html

Design Complete

Engage in turn-based combat, use skills and items.

Shop / Merchant

designs/shop.html

Design Complete

View gold, browse items for sale, buy items.

Shrine

designs/shrine.html

Design Complete

Choose one of three powerful, temporary, or permanent blessings.

Campfire / Rest Stop

designs/campfire.html

Design Complete

Heal the player, open inventory, or save progress.

Game Over

designs/gameoverdesign.html

Design Complete

View run statistics, retry from checkpoint, or return to the main menu.

🌍 HUD & Global UI Behavior

This section defines the behavior of persistent, global UI elements.

Global Elements: The top bar containing Floor Number, Gold Count, and the Inventory Button is a global element.

Visibility Rule: These global elements should only be visible on screens that appear after Character Selection (e.g., Dungeon Map, Battle, Shop, Shrine, Campfire). They must not appear on the Main Menu or Character Selection screens.

Language Toggle: The language toggle button is a global component with a fixed position throughout the entire application and is not considered part of any specific screen's content area.

🔄 Core Gameplay Loop

The player's journey is a floor-by-floor descent through a dungeon, visualized on a map screen.

Start: Player begins at the Main Menu, proceeds to Character Selection, and starts the run.

Dungeon Map: Between floors, the player is shown the Dungeon Progress screen. This map reveals the event types for the upcoming floors (e.g., Battle, Shrine, Shop, Campfire, Boss). The player presses "Continue Descent" to proceed to the next floor.

Encounters: Each floor presents a specific event:

Battle: Standard turn-based combat against enemies.

Shop: Opportunity to spend gold on items from a merchant.

Shrine: Offer a choice of three powerful blessings.

Campfire: A safe room to Rest & Heal, manage inventory, or save progress.

Boss: A unique, powerful enemy at the end of a biome (e.g., Floor 5 or 10).

Progression: After clearing an event, the player gains rewards (XP, gold, items) and returns to the Dungeon Map to see their updated position.

Death: If the player's HP drops to zero, the Game Over screen appears. It displays stats for the run (Floor Reached, XP Earned, Gold Lost) and presents two choices: "Retry from Checkpoint" or "Main Menu".

Checkpoints: Autosave occurs at Floors 5 and 10, preserving XP, level, and equipped gear. The Campfire also offers a manual save option.

Demo Completion: After defeating the Floor 10 boss, a modal will appear: “You have beaten the demo! Please purchase the full game at https://pathofheroes.com/buy.”

🧙 Playable Characters

(Character stats and roles from v31 remain the current standard.)

Class

Character

Resource

Role

Specialization

Warrior

Taha / طه

🟣 Vigor

Tank / Melee

AoE strikes, high DEF

Sorceress

Mais / ميس

🔵 Mana

Ranged Mage

AoE, CC, Elemental Wheel

Rogue

Ibrahim / إبراهيم

🟢 Energy

Assassin

Traps, high SPD & Crit

⚔️ Combat System

(Combat mechanics from v31 remain the current standard. The UI is now defined by designs/battle.html.)

🎒 Inventory, Loot & Potions

Loot Drop Rules:

Standard Enemies: Every non-boss enemy is guaranteed to drop a loot item upon defeat.

Loot Rarity: While the drop is guaranteed, the item's quality is variable. The rarity (Common, Uncommon, Rare, etc.) is determined by the weighted percentages defined in the RARITIES configuration.

Bosses: Bosses drop a selection of major, higher-quality loot.

Potions & Consumables:

Types: Players can find and use various consumables. Confirmed types include:

Health Potion: Restores health.

Elixir: Restores a primary resource (Vigor, Mana, etc.).

Antidote: Cures negative status effects like poison.

Acquisition: These items can be found as loot, purchased from Shops, or awarded at Shrines.

Usage: Using a consumable during combat counts as a player's turn.

⚙️ Architecture & File Structure

This outlines the planned file architecture for the project.

path-of-heroes-rpg/
├─ designs/
│  ├─ newcharacters.html
│  ├─ dungeonprogress.html
│  ├─ battle.html
│  ├─ shop.html
│  ├─ shrine.html
│  ├─ campfire.html
│  └─ gameoverdesign.html
├─ index.html
├─ css/
│  ├─ main.css
│  ├─ battle.css
│  └─ inventory.css
├─ js/
│  ├─ core/
│  │  ├─ config.js
│  │  ├─ localization.js
│  │  ├─ state.js
│  │  └─ game.js
│  ├─ systems/
│  │  ├─ combat.js
│  │  └─ inventory.js
│  └─ main.js
├─ assets/
│  ├─ images/
│  ├─ audio/
│  └─ videos/
└─ README.md

🛠️ Development & Version Control

Development Guidelines

The design blueprint files referenced in the UI table shall be used as the visual and functional guides for all screen implementation. The existing JavaScript modules must be updated to manage the state and logic for these screens and gameplay events.

AI Collaboration Rules

The "Jump Code" Navigation Rule: To make navigating long responses easy, every response containing code will have a File Index at the top. Each file will have a unique Jump Code (e.g., jump-V.X.X-1). Use Ctrl+F to find the code instantly.

The Commit Message Rule: To keep project history clean, all commit messages must follow a three-part structure: Title, Body, and Footer.

Title: type(scope): subject (e.g., feat(ui): Add shop screen).

Body: (Optional) A brief explanation of the change.

Footer: Version: V.X.X.X.

✅ Log of Major Historical Updates

v30 - v31: Initial project setup, scope definition, and core mechanics established.

v32: Overhauled UI/UX with new screen designs for Character Selection, Dungeon Map, Shop, Shrine, Campfire, and Game Over.

v32.1 - v32.4: Added and refined development rules, including Version Control, AI Collaboration guidelines, and the "Static Layouts" master rule.

v32.5: Finalized the battle screen design and established rules for the global UI (Floor/Gold/Inventory display) and consumables.

v32.6 - v32.8: Implemented the Global HUD, refactored the Character Selection and Battle screens, and implemented the guaranteed loot drop system.

v32.9: (Current) Consolidated all project information into this single, authoritative README.md file. This file will now be the single source of truth, with all future changes tracked via Git commits.