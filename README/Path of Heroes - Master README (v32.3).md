Path of Heroes – Master README (v32.3)
Last Updated: July 9, 2025
GitHub Repository: https://github.com/thewahish/path-of-heroes-rpg
Current Status: ~70% complete (Core loop logic implemented; UI designs finalized and documented; project file structure updated for better organization).

📘 Project Purpose & Master Record
This document is the authoritative Master Game Guide / Project Bible for Path of Heroes. It consolidates all design decisions, feature breakdowns, development notes, and critical updates. All changes must be logged here to maintain continuity.

Contents:

Full visual, structural, and gameplay documentation

UI & Screen Design Blueprints

Architecture & File Structure

Phase-by-phase development roadmap

Bilingual support architecture

UI/UX design methodology

Development, version control, and testing policies

Version update log

🎮 Game Overview
(This section remains unchanged from v32.2)

🎨 UI & Screen Design Blueprints
This section serves as the official registry for all UI design mockups. The blueprint files are stored in the designs/ directory of the project.

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


Export to Sheets
🎨 UI Design Principles & Color Palette
(This section remains unchanged from v32.2)

🔄 Core Gameplay Loop
(This section remains unchanged from v32.2)

🧙 Playable Characters
(This section remains unchanged from v31)

⚔️ Combat System
(This section remains unchanged from v31)

⚙️ Architecture & File Structure
This outlines the planned file architecture for the project.

path-of-heroes-rpg/
├─ designs/
│  ├─ newcharacters.html
│  ├─ dungeonprogress.html
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
└─ ...
🛠️ Development & Version Control
Development Guidelines
The design blueprint files referenced in the table above shall be used as the visual and functional guides for implementing their respective screens in the game engine. The existing JavaScript modules (game.js, state.js, etc.) must be updated to manage the state and logic for these new screens and gameplay events.

AI Collaboration Rules
The "Jump Code" Navigation Rule

Purpose: To make navigating long responses with multiple files easy and reliable using a browser's "Find" feature.

How it Works: At the top of every response containing code, a File Index will be provided. Next to each file (and the commit message), there will be a unique Jump Code in the format jump-VERSION-IDENTIFIER.

Example: jump-V.2.1.0-1 for the first file, jump-V.2.1.0-C for the commit message. To use it, copy the Jump Code, press Ctrl+F (or Cmd+F), paste the code, and your browser will jump directly to that section.

The Commit Message Rule

Purpose: To keep our project history clean, professional, and easy to understand.

Format: Commit messages must follow a three-part structure: Title, Body, and Footer.

Title: A short summary of the change. Format: type(scope): subject.

Body: (Optional) A brief paragraph explaining the what and why of the change.

Footer: A single line for the version number. Format: Version: V.X.X.X.

✅ Log of Major Historical Updates
v30 - v31: Initial setup, scope definition.

v32: Overhauled UI/UX with new screen designs.

v32.1: Added formal Version Control and AI Collaboration rules.

v32.2: Added the UI & Screen Design Blueprints table to the guide.

v32.3: (Current) Reorganized project structure to place all design mockups in a dedicated /designs folder. Updated guide to reflect new paths.