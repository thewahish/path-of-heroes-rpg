Path of Heroes: Master Game Bible (v3.0)Path of Heroes: Master Game Bible (v3.0)
I. Core Directives & AI Behavior
A1. Single-File Architecture Mandate

All code in ONE index.html file

HTML: Complete structure with screen containers

CSS: Single <style> tag in <head>

JS: Single <script> before </body>

NO external files, imports, or CDNs

A2. Proactive Design Requirements

Mobile-first: Touch targets ≥ 48px, font sizes ≥ 16px

Color Contrast: WCAG AA compliance for all text

Flow Optimization: Max 3-tap depth to core actions

Visual Suggestions: Use emojis, CSS gradients, SVG filters

A3. Bilingual Implementation Protocol

Localization object with en/ar keys

RTL flipping for Arabic: [dir="rtl"] CSS rules

Dynamic text replacement via data-lang-key

Bi-directional font stack: Cinzel (EN), Noto Sans Arabic (AR)

A4. Feature Implementation Workflow

Requirement confirmation

UI/UX mockup description

Chunked implementation plan

Full index.html output with commit message

A5. Output Specifications

Complete index.html in every response

Commit message format: type(scope): description

Version-less semantic messages (e.g., feat(battle): Add skill system)

A6. Session Workflow

First message: "What is our main goal for this session?"

Large tasks: Automatically break into phases

Progress tracking against Section B spec

II. Game Specification
B1. Core Vision & Constraints
Diagram
Code
graph TD
    A[Portrait Mobile] --> B[Single HTML File]
    B --> C[10-Floor Demo]
    C --> D[Ancient Ruins Biome]
    D --> E[Lich King Boss]
B2. Gameplay Loop
Flow:
Main Menu → Character Select → Floor 1 → [Event] → ... → Floor 10 → Victory

Events (Per Floor):

Battle (70%)

Shop (15%)

Shrine (10%)

Campfire (5%)

Death Sequence:

Show random bilingual message

Remove 90% gold

Clear unequipped items

Respawn at checkpoint (F1/F5)

Victory Condition:

Modal with purchase link: https://pathofheroes.com/buy

B3. Stats & Formulas
Core Stats:

HP, ATK, DEF, SPD, CRIT

Scaling:

javascript
// GameConfig.js (pseudo)
const GameConfig = {
  enemyScale: (floor) => 1 + (floor * 0.15),
  xpRequired: (level) => Math.floor(100 * Math.pow(1.5, level-1))
}
Combat Formulas:

Damage: (ATK * skillMod) - DEF

Crit: baseCrit + gearCritBonus

Flee: 30% + (SPD * 0.5)%

B4. Character Classes
Class	Name (EN/AR)	Resource	Unlocks
Warrior	Taha / طه	🟣 Vigor	L1: Block
L5: Taunt
L10: Whirlwind
Sorceress	Mais / ميس	🔵 Mana	L1: Fireball
L5: Ice Barrier
L10: Meteor
Rogue	Ibrahim / إبراهيم	🟢 Energy	L1: Poison
L5: Shadowstep
L10: Death Mark
B5. Loot & Inventory
Rarity Distribution:

Diagram
Code
pie
    title Loot Rarity %
    “Common” : 50
    “Uncommon” : 35
    “Rare” : 15
    “Epic” : 3
    “Mythic” : 0.8
    “Legendary” : 0.2
Rarity Colors:

Common: #95a5a6

Uncommon: #27ae60

Rare: #3498db

Epic: #9b59b6

Mythic: #e67e22

Legendary: #f1c40f

Inventory Rules:

Combat: Only consumables usable (consumes turn)

Gear: Locked during combat

Capacity: 20 slots

B6. UI/UX Specifications
Required Screens:

Main Menu

Character Select

Global HUD

Battle

Shop

Shrine

Campfire

Game Over

Victory

Color Palette:

Background: radial-gradient(ellipse at center, #1a0f0a 0%, #0d0604 40%, #000000 100%)

Primary: #d4a656

Text: #f8e4c0

Health: linear-gradient(90deg, #8b0000, #ff4500)

Mana: linear-gradient(90deg, #191970, #4169e1)

UI Functions:

javascript
function updateBar(id, current, max) {
  const fill = document.getElementById(`${id}-fill`);
  fill.style.width = `${(current/max)*100}%`;
  document.getElementById(`${id}-value`).textContent = `${current}/${max}`;
}

function updateElement(id, value) {
  document.getElementById(id).textContent = value;
}
B7. Future Systems (Placeholders)
Elemental Wheel:

Diagram
Code
graph LR
    Fire --> Ice
    Ice --> Nature
    Nature --> Shadow
    Shadow --> Fire
Status Effects:

Poison: DOT 5% HP/turn

Burn: ATK -30%

Freeze: SPD -50%

III. Current Implementation Status
Completed Systems:
System	Status	Notes
Localization	✅	Full EN/AR support
Character Select	✅	All 3 classes
Battle Core	✅	ATK/DEF/Skill/Flee
Progression	⚠️	Floor scaling done
Death Sequence	⚠️	Gold penalty only
Missing Features:
Event System (Shop/Shrine/Campfire)

Inventory & Loot Implementation

Leveling & Abilities (L5/L10 unlocks)

Checkpoint Saving (Gear/XP)

Victory Condition Modal

Game Over Encouragements

Rarity Color Application

Dynamic UI Functions

Consumables System

Boss Mechanics (Lich King)

Technical Debt:
Hardcoded enemy names

No item stat application

Limited RTL testing

Mobile viewport optimization

No save/load functionality

IV. Session Protocol
Initialization:
"I have loaded the Path of Heroes bible. What is our main goal for this session?"

Task Processing:

Break requests into atomic units

Validate against Section B spec

Provide implementation plan

Output Delivery:
Complete index.html with:

html
<!-- Commit: type(scope): message -->
<!DOCTYPE html>
...full implementation...
Session Conclusion:
"Next recommended phase: [System]. Continue?"

Commit Message: docs: Release Master Game Bible v3.0 with full spec

This document contains all specifications, constraints, and current state required to continue development from any point. The structured format ensures consistent implementation according to the original vision while providing clear progress tracking.


I. Core Directives & AI Behavior
A1. Single-File Architecture Mandate

All code in ONE index.html file

HTML: Complete structure with screen containers

CSS: Single <style> tag in <head>

JS: Single <script> before </body>

NO external files, imports, or CDNs

A2. Proactive Design Requirements

Mobile-first: Touch targets ≥ 48px, font sizes ≥ 16px

Color Contrast: WCAG AA compliance for all text

Flow Optimization: Max 3-tap depth to core actions

Visual Suggestions: Use emojis, CSS gradients, SVG filters

A3. Bilingual Implementation Protocol

Localization object with en/ar keys

RTL flipping for Arabic: [dir="rtl"] CSS rules

Dynamic text replacement via data-lang-key

Bi-directional font stack: Cinzel (EN), Noto Sans Arabic (AR)

A4. Feature Implementation Workflow

Requirement confirmation

UI/UX mockup description

Chunked implementation plan

Full index.html output with commit message

A5. Output Specifications

Complete index.html in every response

Commit message format: type(scope): description

Version-less semantic messages (e.g., feat(battle): Add skill system)

A6. Session Workflow

First message: "What is our main goal for this session?"

Large tasks: Automatically break into phases

Progress tracking against Section B spec

II. Game Specification
B1. Core Vision & Constraints
Diagram
Code
graph TD
    A[Portrait Mobile] --> B[Single HTML File]
    B --> C[10-Floor Demo]
    C --> D[Ancient Ruins Biome]
    D --> E[Lich King Boss]
B2. Gameplay Loop
Flow:
Main Menu → Character Select → Floor 1 → [Event] → ... → Floor 10 → Victory

Events (Per Floor):

Battle (70%)

Shop (15%)

Shrine (10%)

Campfire (5%)

Death Sequence:

Show random bilingual message

Remove 90% gold

Clear unequipped items

Respawn at checkpoint (F1/F5)

Victory Condition:

Modal with purchase link: https://pathofheroes.com/buy

B3. Stats & Formulas
Core Stats:

HP, ATK, DEF, SPD, CRIT

Scaling:

javascript
// GameConfig.js (pseudo)
const GameConfig = {
  enemyScale: (floor) => 1 + (floor * 0.15),
  xpRequired: (level) => Math.floor(100 * Math.pow(1.5, level-1))
}
Combat Formulas:

Damage: (ATK * skillMod) - DEF

Crit: baseCrit + gearCritBonus

Flee: 30% + (SPD * 0.5)%

B4. Character Classes
Class	Name (EN/AR)	Resource	Unlocks
Warrior	Taha / طه	🟣 Vigor	L1: Block
L5: Taunt
L10: Whirlwind
Sorceress	Mais / ميس	🔵 Mana	L1: Fireball
L5: Ice Barrier
L10: Meteor
Rogue	Ibrahim / إبراهيم	🟢 Energy	L1: Poison
L5: Shadowstep
L10: Death Mark
B5. Loot & Inventory
Rarity Distribution:

Diagram
Code
pie
    title Loot Rarity %
    “Common” : 50
    “Uncommon” : 35
    “Rare” : 15
    “Epic” : 3
    “Mythic” : 0.8
    “Legendary” : 0.2
Rarity Colors:

Common: #95a5a6

Uncommon: #27ae60

Rare: #3498db

Epic: #9b59b6

Mythic: #e67e22

Legendary: #f1c40f

Inventory Rules:

Combat: Only consumables usable (consumes turn)

Gear: Locked during combat

Capacity: 20 slots

B6. UI/UX Specifications
Required Screens:

Main Menu

Character Select

Global HUD

Battle

Shop

Shrine

Campfire

Game Over

Victory

Color Palette:

Background: radial-gradient(ellipse at center, #1a0f0a 0%, #0d0604 40%, #000000 100%)

Primary: #d4a656

Text: #f8e4c0

Health: linear-gradient(90deg, #8b0000, #ff4500)

Mana: linear-gradient(90deg, #191970, #4169e1)

UI Functions:

javascript
function updateBar(id, current, max) {
  const fill = document.getElementById(`${id}-fill`);
  fill.style.width = `${(current/max)*100}%`;
  document.getElementById(`${id}-value`).textContent = `${current}/${max}`;
}

function updateElement(id, value) {
  document.getElementById(id).textContent = value;
}
B7. Future Systems (Placeholders)
Elemental Wheel:

Diagram
Code
graph LR
    Fire --> Ice
    Ice --> Nature
    Nature --> Shadow
    Shadow --> Fire
Status Effects:

Poison: DOT 5% HP/turn

Burn: ATK -30%

Freeze: SPD -50%

III. Current Implementation Status
Completed Systems:
System	Status	Notes
Localization	✅	Full EN/AR support
Character Select	✅	All 3 classes
Battle Core	✅	ATK/DEF/Skill/Flee
Progression	⚠️	Floor scaling done
Death Sequence	⚠️	Gold penalty only
Missing Features:
Event System (Shop/Shrine/Campfire)

Inventory & Loot Implementation

Leveling & Abilities (L5/L10 unlocks)

Checkpoint Saving (Gear/XP)

Victory Condition Modal

Game Over Encouragements

Rarity Color Application

Dynamic UI Functions

Consumables System

Boss Mechanics (Lich King)

Technical Debt:
Hardcoded enemy names

No item stat application

Limited RTL testing

Mobile viewport optimization

No save/load functionality

IV. Session Protocol
Initialization:
"I have loaded the Path of Heroes bible. What is our main goal for this session?"

Task Processing:

Break requests into atomic units

Validate against Section B spec

Provide implementation plan

Output Delivery:
Complete index.html with:

html
<!-- Commit: type(scope): message -->
<!DOCTYPE html>
...full implementation...
Session Conclusion:
"Next recommended phase: [System]. Continue?"

Commit Message: docs: Release Master Game Bible v3.0 with full spec

This document contains all specifications, constraints, and current state required to continue development from any point. The structured format ensures consistent implementation according to the original vision while providing clear progress tracking.
