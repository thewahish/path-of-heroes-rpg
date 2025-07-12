 * Path of Heroes - Master README (v32.5) --- (Jump Code: jump-V.32.5-1)
 * GitHub Commit Suggestion -> (Jump Code: jump-V.32.5-C)
jump-V.32.5-1 - File: Path of Heroes - Master README (v32.5)
Path of Heroes – Master README (v32.5)
Last Updated: July 10, 2025
GitHub Repository: https://github.com/thewahish/path-of-heroes-rpg
Current Status: ~70% complete (Global UI rules and new battle screen design finalized; loot system rules updated).
📘 Project Purpose & Master Record
(This section remains unchanged)
🌍 HUD & Global UI
This section defines the behavior of persistent, global UI elements.
 * Global Elements: The top bar containing Floor Number, Gold Count, and the Inventory Button is a global element.
 * Visibility Rule: These global elements should only be visible on screens that appear after Character Selection (e.g., Dungeon Map, Battle, Shop, Shrine, Campfire). They must not appear on the Main Menu or Character Selection screens.
 * Language Toggle: The language toggle button is a global component with a fixed position throughout the entire application and is not considered part of any specific screen's content area.
🎨 UI & Screen Design Blueprints
This section serves as the official registry for all UI design mockups. The blueprint files are stored in the designs/ directory.
| Screen/Feature | Design Blueprint File | Status | Key Functionality |
|---|---|---|---|
| Character Selection | designs/newcharacters.html | Design Complete | Select hero via tabs, view stats, start a new run. |
| Dungeon Progress Map | designs/dungeonprogress.html | Design Complete | View upcoming floor events, advance to the next floor. |
| Battle Screen | designs/battle.html | Design Complete | Engage in turn-based combat, use skills and items. |
| Shop / Merchant | designs/shop.html | Design Complete | View gold, browse items for sale, buy items. |
| Shrine | designs/shrine.html | Design Complete | Choose one of three powerful blessings. |
| Campfire / Rest Stop | designs/campfire.html | Design Complete | Heal the player, open inventory, or save progress. |
| Game Over | designs/gameoverdesign.html | Design Complete | View run statistics, retry from checkpoint, or return to menu. |
🎨 UI Design Principles & Color Palette
(This section remains unchanged from v32.4)
🔄 Core Gameplay Loop
(This section remains unchanged from v32.3)
⚔️ Combat System
(Combat mechanics remain unchanged, but the UI is now defined by designs/battle.html)
🎒 Inventory, Loot & Potions
 * Loot Drop Rules:
   * Standard Enemies: Every non-boss enemy is guaranteed to drop loot upon defeat.
   * Bosses: Bosses drop a selection of major, higher-quality loot.
   * (Developer Note: This "always drop" rule requires updating the current percentage-based dropChance logic.)
 * Potions & Consumables:
   * Types: Players can find and use various consumables. Confirmed types include:
     * Health Potion: Restores health.
     * Elixir: Restores a primary resource (Vigor, Mana, etc.).
     * Antidote: Cures negative status effects like poison.
   * Acquisition: These items can be found as loot, purchased from Shops, or awarded at Shrines.
   * Usage: Using a consumable during combat counts as a player's turn.
⚙️ Architecture & File Structure
(This section remains unchanged from v32.3)
🛠️ Development & Version Control
(This section remains unchanged from v32.3)
✅ Log of Major Historical Updates
 * v32 - v32.4: Initial setup, UI finalization, and documentation of development rules.
 * v32.5: (Current) Finalized the battle screen design. Established new rules for the global UI (Floor/Gold/Inventory display). Updated and clarified loot drop and potion/elixir systems.
jump-V.32.5-C - GitHub Commit Suggestion
docs(project): Finalize battle design and global UI rules

Updates the Master Guide to v32.5.

- Establishes new rules for the global HUD (Floor, Gold, Inventory), defining its visibility and placement across screens.
- Replaces the previous battle screen concept with the new, finalized design from `designs/battle.html`.
- Updates the loot system rules to reflect guaranteed drops from mobs and major drops from bosses.
- Officially adds Elixirs and Antidotes to the list of in-game consumables.

Version: V.32.5