Path of Heroes – Master README (v36.5)

Last Updated: July 11, 2025

GitHub Repository: https://github.com/thewahish/path-of-heroes-new

Current Status: In progress (~75% complete). Game engine loads with some console warnings (e.g., missing elements now fixed; battle screen visibility improved). Debugger panel active but formatting refined; battle state shows in debugger but screen may require explicit toggle. Added full debug.js implementation for assessment. Enforcing new scope/rules: Demo limited to 10 floors (1 biome, boss at 10); full game 60 floors (6 biomes). All code/files must adhere to these updates—override any outdated references (e.g., 20-floor demo, 5-floor bosses/biomes).

📘 Project Purpose & Master Record

This document is the authoritative Master Game Guide / Project Bible for Path of Heroes. It consolidates all design decisions, feature breakdowns, development notes, and critical updates. All changes must be logged here via versioned commits to maintain continuity. Serves as a comprehensive master gameplan for backups/resumes.

Contents:

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
Development & Version Control
Log of Major Historical Updates
🎮 Game Overview

Title: Path of Heroes / طريق الأبطال

Genre: 2D top-down, turn-based roguelike dungeon crawler (inspired by Hades, Dead Cells, Slay the Spire, Diablo).

Platform: Mobile-only web game (HTML/CSS/JS), PWA-ready for Android/iOS.

Orientation: Strictly portrait mode on all screens (fits tablets with centered content; preferably no black bars unless needed and unless it won't change the whole design and make it offset).

Technology: Multi-file structure with index.html as entry point, modular JS/CSS in subfolders; mockups generated as standalone single HTML files for testing without breaking the main codebase.

Languages: Fully bilingual (English/Arabic) with dynamic RTL switching.

Visual Style: Dark fantasy with Arabic/English fusion, high contrast, low saturation, glowing effects for rare items.

Input: Touch-only with on-screen buttons and gestures.

Scope: Demo is Only 10 floors. each Biome is 10 floors. only one boss per demo then demo message. full game is 60 levels so 5 more biomes (sand, fire, ice, water, wind) in addition to first one already there.

🎨 UI/UX Design Principles & Rules

This section outlines the non-negotiable "Golden Rules" for all UI/UX development.

Portrait-Only: All screens are designed and optimized exclusively for portrait orientation. No landscape support will be implemented. Layouts must fit tablets (centered, with black bars if screen exceeds mobile dimensions).
Static Layouts: All UI elements, especially those containing text like buttons and panels, must have static, fixed dimensions. These dimensions should be calculated to accommodate the text of all supported languages without causing the element to resize or shift the layout. Text within these elements should be centered to handle varying string lengths gracefully.
No Scrolling: UI layouts must fit within a standard mobile viewport without requiring vertical scrolling.
Note: The shop.html design includes a scrollable item grid (overflow-y: auto). This must be reviewed and refactored into a paginated view to adhere to this rule.
Safe Zones: All interactive UI elements should be contained within 80-95% of the screen area to ensure accessibility and prevent accidental taps on all devices.
No Redundant Globals: Global controls like the language toggle are part of the main game shell and should not be re-implemented or redesigned within individual screen mockups.
Mobile-First Sizing: Cap screen width at 480px (max-width) for mobile focus; disable zoom/scaling via viewport meta tag.
Dark RPG Palette:

Background: radial-gradient(ellipse at center, #1a0f0a 0%, #0d0604 40%, #000000 100%) (fallback).
Shrine Background: url('assets/bg_shrine_dark_forest.jpg').
Primary: #d4a656 (Dark gold).
Secondary: #5c4423 (Saddle brown).
Text: #f8e4c0 (Wheat).
Health: linear-gradient(90deg, #8b0000, #ff4500, #ff6347).
Mana: linear-gradient(90deg, #191970, #4169e1, #87ceeb).
Rarity Colors:

Common: Gray (#95a5a6)
Uncommon: Green (#27ae60)
Rare: Blue (#3498db)
Epic: Purple (#9b59b6)
Mythic: Orange (#e67e22)
Legendary: Gold (#f1c40f)
🖥️ UI & Screen Design Blueprints

This section serves as the official registry for all UI design mockups. The blueprint files are stored in the designs/ directory of the project and act as the visual/functional source of truth.


Screen/Feature	Design Blueprint File	Status	Key Functionality
Character Selection	designs/new_character_screen_v3.html	Design Complete (Mockup Updated)	Select hero via tabs, view portrait/name/title/desc by default; "Core Strengths" box with emojis; "Show Stats" toggle (circle 'i') to reveal detailed stats (HP, ATK, DEF, SPD, Crit). Elegant Diablo-like dark fantasy vibe.
Dungeon Progress Map	designs/dungeonprogress.html	Deprecated (Removed)	N/A (Feature removed for random events).
Battle Screen	designs/battle.html	Design Complete	Engage in turn-based combat, use skills and items.
Shop / Merchant	designs/shop.html	Design Complete	View gold, browse items for sale, buy items.
Shrine	designs/shrine.html	Design Complete	Choose one of three powerful, temporary, or permanent blessings.
Campfire / Rest Stop	designs/campfire.html	Design Complete	Heal the player, open inventory, or save progress.
Game Over	designs/gameoverdesign.html	Design Complete	View run statistics, retry from checkpoint, or return to the main menu.
🌍 HUD & Global UI Behavior

This section defines the behavior of persistent, global UI elements.

Global Elements: The top bar containing Floor Number, Gold Count, and the Inventory Button is a global element.
Visibility Rule: These global elements should only be visible on screens that appear after Character Selection. They must not appear on the Main Menu or Character Selection screens.
Language Toggle: The language toggle button is a global component with a fixed position throughout the entire application.
Inventory Global Button Note: Inventory global button at top expands when pressing on it (if not there) and minimizes when pressing outside of it or there should be a minimize option.
🔄 Core Gameplay Loop

The player's journey is a floor-by-floor descent through a dungeon.

Start: Player begins at the Main Menu, proceeds to Character Selection, and starts the run.
Encounters: Events are random (no dungeon map) for roguelike randomization vibe. Each bottom floor presents a random event (Battle, Shop, Shrine, Campfire, Boss). After clearing, gain rewards (XP, gold, items). Narrative events (e.g., “You feel an ancient energy stir…”) before shops/shrines/bosses—prepare multiple randomized messages in code. Same for mob names, etc.
Progression: Procedural floors across biomes; boss every 10th floor.
Death Penalty: If HP drops to zero, lose 90% gold and all non-equipped items; respawn at biome start (Floors 1, 5). Game Over screen shows stats and options: "Retry from Checkpoint" or "Main Menu."
Checkpoints: Autosave every 5th floor (preserves XP, level, equipped gear); manual save at Campfire.
Demo Completion: After Floor 10 boss, modal: “You have beaten the demo! Please support us via our Kickstarter page.”

Floors	Biome	Enemies	Boss
1–10	Ancient Ruins	Skeletons, Slimes	Lich King
11–20	Sand	(Planned for full game)	(Planned)
21–30	Fire	(Planned for full game)	(Planned)
31–40	Ice	(Planned for full game)	(Planned)
41–50	Water	(Planned for full game)	(Planned)
51–60	Wind	(Planned for full game)	(Planned)
🐛 Debugger System

This section documents the on-screen debugger feature used for development and troubleshooting.

Feature Overview: The debugger provides an on-screen panel displaying real-time game state (e.g., current screen, player stats, gold) for troubleshooting. Active only when DEBUG_MODE is true in config.js.

Core Functionality:

Hidden by Default: The main debug panel is hidden on start.
Activation: Via persistent bug icon (🐛) in bottom-left (toggles visibility).
Real-time Info: Updates every second when visible.
Global Scope: Available on all screens.
Formatting: Panel should use clean, readable styling (e.g., monospace font, line breaks for state objects).
Implementation Details: Self-contained module (js/debug.js) initialized by js/main.js. Full implementation now provided for reconstruction/assessment.

HTML Structure (in index.html):

html

Collapse

Wrap

Copy
<button id="debug-open-btn" class="global-btn" aria-label="Open Debug Panel">🐛</button>  
<div id="debug-panel" class="hidden">  
    <button id="debug-toggle-btn" aria-label="Close Debug Panel">×</button>  
    <div id="debug-content"></div>  
</div>
JavaScript Logic (in js/debug.js):

javascript

Collapse

Wrap

Run

Copy
// js/debug.js
// Full implementation based on project specs  

window.Debugger = class Debugger {  
    constructor(gameInstance) {  
        this.game = gameInstance;  
        this.panel = document.getElementById('debug-panel');  
        this.content = document.getElementById('debug-content');  
        this.openBtn = document.getElementById('debug-open-btn');  
        this.toggleBtn = document.getElementById('debug-toggle-btn');  
        this.updateInterval = null;  
    }  

    init() {  
        if (!window.GameConfig.DEBUG_MODE) return;  

        // Attach button listeners  
        this.openBtn.addEventListener('click', () => this.togglePanel());  
        this.toggleBtn.addEventListener('click', () => this.togglePanel());  

        // Initial update  
        this.updateDebugInfo();  
    }  

    togglePanel() {  
        this.panel.classList.toggle('hidden');  
        if (!this.panel.classList.contains('hidden')) {  
            this.startUpdates();  
        } else {  
            this.stopUpdates();  
        }  
    }  

    startUpdates() {  
        this.updateDebugInfo();  
        this.updateInterval = setInterval(() => this.updateDebugInfo(), 1000);  
    }  

    stopUpdates() {  
        if (this.updateInterval) clearInterval(this.updateInterval);  
    }  

    updateDebugInfo() {  
        if (!this.content) return;  
        const state = this.game.state || {}; // Assuming game.state holds current data  
        let info = `Current Screen: ${state.currentScreen || 'Unknown'}\n`;  
        info += `Player: ${JSON.stringify(state.player, null, 2)}\n`;  
        info += `Gold: ${state.gold || 0}\n`;  
        info += `Floor: ${state.currentFloor || 1}\n`;  
        info += `Inventory: ${JSON.stringify(state.inventory, null, 2)}\n`;  
        // Add more state as needed  
        this.content.textContent = info; // Use textContent for pre-formatted  
    }  
};
🧙 Playable Characters


Class	Character	Resource	Role	Specialization	Core Strengths (Examples)
Warrior	Taha / طه	🟣 Vigor	Tank / Melee	AoE strikes, high DEF	🛡️ High Defense, ❤️ High Health
Sorceress	Mais / ميس	🔵 Mana	Ranged Mage	AoE, CC, Elemental Wheel	🔮 Elemental Mastery, ❄️ Crowd Control
Rogue	Ibrahim / إبراهيم	🟢 Energy	Assassin	Traps, high SPD & Crit	⚡ High Speed, 💥 High Crit
Progression: Max level 20; abilities unlock at Levels 1, 5, 10, 15. Stats: HP, ATK, DEF, SPD, Crit by default and also abilities randomly increase by shrines.
⚔️ Combat System

Turn-based, initiative based on SPD. Actions: Attack, Skill, Defend, Flee. Critical hits vary by class (10-20%). Status effects (planned): Poison, Burn, Freeze, Stun, Shield, Regen. Elemental Wheel (planned): Fire > Ice > Nature > Shadow > Fire. UI defined by designs/battle.html.

🎒 Inventory, Loot & Potions

Gear Slots: 8 (Head, Shoulders, Chest, Legs, Feet, Hands, Weapon, Accessory).
Loot Naming: [Prefix] [Base] of [Suffix] (e.g., “Ancient Sword of the Lich King”).
Loot Drop Rules: Standard enemies guarantee 1 drop; rarity weighted (Common: 50%, Uncommon: 30%, Rare: 15%, Epic: 4%, Mythic: 0.8%, Legendary: 0.2%). Bosses drop higher-quality items. Item Level Formula: (ATK + DEF + bonusEffectScore) × rarityMultiplier + classAffinity.
Potions & Consumables: Health Potion (restore HP), Elixir (restore resource), Antidote (cure status). Acquired via loot/shops/shrines; use counts as a turn in combat.
Item Display Note: Always show item level when hovering on weapon whether it was in inventory or character.
⚙️ Architecture & File Structure

path-of-heroes-new/

├─ designs/ (as in blueprints table)

├─ index.html

├─ css/ (main.css, battle.css, inventory.css)

├─ js/

│  ├─ core/ (config.js, localization.js, state.js, game.js)

│  ├─ systems/ (combat.js, inventory.js)

│  ├─ debug.js

│  └─ main.js

├─ assets/ (images/, audio/, videos/)

└─ README.md

Planned Expansions: Add entities/ (player.js, enemy.js), ui/ (renderer.js), data/ (localization.json, items.json).

🛠️ Development & Version Control

Development Guidelines: Use blueprint files as guides. Update JS modules for state/logic. Test in mobile PWA for portrait/touch. Prioritize loading/debug fixes before new features.

AI Collaboration Rules:

Jump Code Navigation System: In code responses, provide a File Index with unique Jump Codes (e.g., jump-V.X.X-1 for files, -C for commits). Use Ctrl+F to navigate. Additionally, at the top of each code block for a file, include a comment indicator like '// filename.js' to identify the file when copied standalone.
Internal Testing & Simulation Rule: After generating code, perform a full internal simulation (trace execution as browser engine). Audit for truncation, syntax/logical errors, dependencies. Fix issues before delivery; report if user input needed.
Mockup Rule for New Designs: When adding/updating designs (e.g., new HTML screens), first generate as standalone mockup HTML (testable with button logs like "Button press successful"). Avoid breaking current code; integrate only after mockup approval.
Chat Management: If context grows heavy (e.g., causing truncation or performance issues), suggest new chat. Additionally, if the user indicates the chat is getting heavy (even if not evident), prepare to move to another chat to avoid reinventing the wheel and missing directions/progress. Consolidate README with all changes/commits as prompt starter.
Commit Message Rule: Format: Title (type(scope): subject), Body (explanation), Footer (Version: V.X.X.X).

✅ Log of Major Historical Updates

v30-v31: Initial setup, scope definition, core mechanics.
v32: Overhauled UI/UX with new screen designs.
v32.1-v32.4: Added Version Control/AI rules, "Static Layouts" rule.
v32.5: Finalized battle design, global HUD rules, loot/potion updates.
v32.6-v32.8: Implemented global HUD, refactored screens, guaranteed loot.
v32.9: Consolidated into single README as source of truth.
v32-v34: Initial setup, UI finalization, rule documentation, startup bug fixes.
v35.0-v35.3: Fixed formatting/typos in game.js.
v35.4: Full project export (stable loading state).
v35.5: Added Debugger System section.
v36.0: Consolidated historical READMEs; integrated biomes/rarities from parallel docs.
v36.1: Added Jump Code/Internal Testing/Mockup/Chat Management rules. Updated Character Selection blueprint (new layout: default view with strengths, stats toggle). Integrated v28 character details. Noted bugs/fixes in status.
v36.2: Reconstructed full debug.js implementation for missing file. Updated architecture to include js/debug.js. Assessed progress: Core systems (loading, UI screens) functional; bugs like missing IDs fixed; debugger now fully coded for state display and updates.
v36.3: Updated scope to 10-floor demo (1 biome, boss at 10); full game 60 floors (6 biomes). Removed dungeon map for random events. Changed boss/biome to every 10 floors, checkpoints every 5. Added randomized narratives/mob names. Updated death respawn (Floors 1,5). Removed Konami code from debugger (mobile-only). Added item level hover display. Updated progression (shrine random increases). Enforced rules override in old code. Adjusted orientation phrasing and inventory expand/minimize note. Updated biomes table with planned full game.
v36.4: Added file identifier comment rule to Jump Code system (e.g., '// filename.js' at top of code blocks for standalone copying).
v36.5: (Current) Refined Chat Management rule to be qualitative (suggest on truncation/performance issues) and user-triggered (prepare new chat if user says it's heavy, regardless of assessment).