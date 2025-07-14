// js/systems/inventory.js
// Inventory System
window.InventorySystem = class InventorySystem {
    constructor(game) {
        this.game = game;
        this.tooltip = null;
    }

    init() {
        this.tooltip = document.getElementById('item-tooltip');
        if (this.tooltip) {
            this.setupEventListeners();
        }
    }

    setupEventListeners() {
        document.addEventListener('mousemove', e => this.updateTooltipPosition(e));
        document.addEventListener('click', () => this.hideTooltip());
    }

    generateItem(itemType, floor = 1, rarity = null) {
        const itemTemplate = window.GameConfig.ITEM_TYPES[itemType];
        if (!itemTemplate) {
            console.error('Unknown item type:', itemType);
            return null;
        }

        if (!rarity) {
            rarity = this.rollRarity();
        }

        const rarityData = window.GameConfig.RARITIES[rarity];
        const id = `${itemType}_${Date.now()}_${Math.random()}`;
        
        const prefix = Math.random() < 0.4 ? this.getRandomAffix('ITEM_PREFIXES') : null;
        const suffix = Math.random() < 0.3 ? this.getRandomAffix('ITEM_SUFFIXES') : null;
        
        const baseStats = { ...(itemTemplate.baseStats || {}) };
        const floorScaling = 1 + (floor - 1) * 0.1;
        
        let finalStats = {};
        Object.keys(baseStats).forEach(stat => {
            finalStats[stat] = Math.floor(baseStats[stat] * floorScaling * rarityData.statMult);
        });
        
        if (prefix && prefix.statMod) {
            Object.keys(prefix.statMod).forEach(stat => {
                finalStats[stat] = (finalStats[stat] || 0) + prefix.statMod[stat];
            });
        }
        if (suffix && suffix.statMod) {
            Object.keys(suffix.statMod).forEach(stat => {
                finalStats[stat] = (finalStats[stat] || 0) + suffix.statMod[stat];
            });
        }

        const lang = this.game.localization.getCurrentLanguage();
        let itemName = itemTemplate.name[lang] || itemTemplate.name.en;
        if (prefix) itemName = `${prefix.name[lang] || prefix.name.en} ${itemName}`;
        if (suffix) itemName = `${itemName} ${suffix.name[lang] || suffix.name.en}`;

        const basePrice = Math.floor((floor + 1) * rarityData.statMult * 5);
        
        return {
            id, type: itemType, name: itemName, rarity,
            slot: itemTemplate.slot,
            icon: itemTemplate.icon,
            stats: finalStats,
            level: floor,
            sellPrice: basePrice,
            description: itemTemplate.description ? (itemTemplate.description[lang] || itemTemplate.description.en) : '',
            consumable: itemTemplate.consumable || false,
            effect: itemTemplate.effect || null,
            value: itemTemplate.value || 0
        };
    }

    rollRarity() {
        const roll = Math.random() * 100;
        let cumulative = 0;
        
        for (const [rarity, data] of Object.entries(window.GameConfig.RARITIES)) {
            cumulative += data.chance;
            if (roll <= cumulative) {
                return rarity;
            }
        }
        return 'common';
    }

    getRandomAffix(affixType) {
        const affixes = window.GameConfig[affixType];
        return affixes[Math.floor(Math.random() * affixes.length)];
    }
    
    generateLootDrop(enemy, floor) {
        const itemTypes = Object.keys(window.GameConfig.ITEM_TYPES);
        const lootableItems = itemTypes.filter(type => window.GameConfig.ITEM_TYPES[type].slot !== null || window.GameConfig.ITEM_TYPES[type].consumable);
        const itemType = lootableItems[Math.floor(Math.random() * lootableItems.length)];
        
        // FIX: The variable was 'randomItemType' which is not defined. It should be 'itemType'.
        return this.generateItem(itemType, floor);
    }

    useItem(item) {
        if (!item || !item.consumable) {
            console.log("Cannot use this item.");
            return false;
        }

        const player = this.game.state.current.player;
        let effectApplied = false;

        switch(item.effect) {
            case 'heal_hp':
                if (player.stats.hp < player.stats.maxHp) {
                    const healAmount = item.value || 25;
                    player.stats.hp = Math.min(player.stats.maxHp, player.stats.hp + healAmount);
                    this.game.updateElement('combat-log-text', `${this.game.localization.getCharacterName(player)} uses a ${item.name} and recovers ${healAmount} HP.`);
                    effectApplied = true;
                } else {
                    alert("Health is already full!");
                }
                break;
            default:
                alert("This item has no effect in combat.");
                break;
        }

        if (effectApplied) {
            this.game.state.removeItemFromInventory(item);
            this.game.updateBattleDisplay();
        }
        
        return effectApplied;
    }

    equipItem(item) {
        if (!item || !item.slot) return false;
        
        const result = this.game.state.equipItem(item);
        if (result) {
            this.updateDisplay();
            if (this.game.state.current.battleInProgress) {
                this.game.updateBattleDisplay();
            }
        }
        return result;
    }

    unequipItem(slot) {
        const result = this.game.state.unequipItem(slot);
        if (result) {
            this.updateDisplay();
            if (this.game.state.current.battleInProgress) {
                this.game.updateBattleDisplay();
            }
        }
        return result;
    }

    sellItem(item) {
        if (!item || !item.sellPrice) return false;
        
        if (!confirm(`Sell ${item.name} for ${item.sellPrice} gold?`)) return false;
        
        const wasEquipped = Object.values(this.game.state.current.equipped).some(equipped => equipped && equipped.id === item.id);
        
        if (wasEquipped) {
            for (const [slot, equippedItem] of Object.entries(this.game.state.current.equipped)) {
                if (equippedItem && equippedItem.id === item.id) {
                    delete this.game.state.current.equipped[slot];
                    break;
                }
            }
        } else {
            this.game.state.removeItemFromInventory(item);
        }
        
        this.game.state.addGold(item.sellPrice);
        this.game.state.updatePlayerStats();
        this.updateDisplay();
        if (this.game.state.current.battleInProgress) {
            this.game.updateBattleDisplay();
        }
        return true;
    }

    sortItems() {
        this.game.state.current.inventory.sort((a, b) => {
            const rarityOrder = ['legendary', 'mythic', 'epic', 'rare', 'uncommon', 'common'];
            const aRarityIndex = rarityOrder.indexOf(a.rarity);
            const bRarityIndex = rarityOrder.indexOf(b.rarity);
            
            if (aRarityIndex !== bRarityIndex) {
                return aRarityIndex - bRarityIndex;
            }
            
            return a.type.localeCompare(b.type);
        });
        
        this.updateDisplay();
    }

    sellAllCommon() {
        const commonItems = this.game.state.current.inventory.filter(item => item.rarity === 'common');
        if (commonItems.length === 0) {
            alert('No common items to sell!');
            return;
        }
        
        const totalValue = commonItems.reduce((sum, item) => sum + item.sellPrice, 0);
        if (confirm(`Sell ${commonItems.length} common items for ${totalValue} gold?`)) {
            commonItems.forEach(item => this.game.state.removeItemFromInventory(item));
            this.game.state.addGold(totalValue);
            this.updateDisplay();
        }
    }

    updateDisplay() {
        this.updateEquipmentGrid();
        this.updateInventoryGrid();
        this.updateCharacterStats();
    }

    updateEquipmentGrid() {
        const grid = document.getElementById('equipment-grid');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        Object.entries(window.GameConfig.EQUIPMENT_SLOTS).forEach(([slot, slotData]) => {
            const slotElement = document.createElement('div');
            slotElement.className = 'equipment-slot';
            slotElement.dataset.slot = slot;
            
            const equippedItem = this.game.state.current.equipped[slot];
            
            if (equippedItem) {
                slotElement.classList.add('occupied', `rarity-${equippedItem.rarity}`);
                slotElement.innerHTML = `<div class="item-icon">${equippedItem.icon}</div>`;
                this.addItemEventListeners(slotElement, equippedItem, true);
            } else {
                slotElement.innerHTML = `<div class="slot-icon-placeholder">${slotData.icon}</div>`;
            }
            
            grid.appendChild(slotElement);
        });
    }

    updateInventoryGrid() {
        const grid = document.getElementById('inventory-grid');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        const maxSlots = window.GameConfig.INVENTORY.maxSlots;
        const inventory = this.game.state.current.inventory;
        
        for (let i = 0; i < maxSlots; i++) {
            const slotElement = document.createElement('div');
            slotElement.className = 'inventory-slot';
            slotElement.dataset.index = i;
            
            if (i < inventory.length && inventory[i]) {
                const item = inventory[i];
                slotElement.classList.add(`rarity-${item.rarity}`);
                slotElement.innerHTML = `<div class="item-icon">${item.icon}</div>`;
                this.addItemEventListeners(slotElement, item, false);
            }
            
            grid.appendChild(slotElement);
        }
    }

    updateCharacterStats() {
        const statsTable = document.getElementById('inventory-stats-table');
        if (!statsTable) return;
        
        const player = this.game.state.current.player;
        if (!player) return;
        
        const lang = this.game.localization.getCurrentLanguage();
        const stats = [
            { key: 'hp', value: `${player.stats.hp}/${player.stats.maxHp}` },
            { key: 'attack', value: player.stats.attack },
            { key: 'defense', value: player.stats.defense },
            { key: 'speed', value: player.stats.speed },
            { key: 'crit', value: `${player.stats.crit}%` },
            { key: 'resource', label: player.resource.name[lang], value: `${player.resource.current}/${player.resource.max}` }
        ];
        
        statsTable.innerHTML = stats.map(statInfo => {
            const locKeyMap = { 'attack': 'atk', 'defense': 'def', 'speed': 'spd' };
            const locKey = `stat.${locKeyMap[statInfo.key] || statInfo.key}`;
            const label = statInfo.label || this.game.localization.getText(locKey);
            return `<tr><td>${label}</td><td>${statInfo.value}</td></tr>`;
        }).join('');

        const title = document.getElementById('inventory-stats-title');
        if(title) {
            title.textContent = this.game.localization.getText('inventory.stats');
        }
    }

    addItemEventListeners(element, item, isEquipped) {
        element.addEventListener('mouseenter', (e) => this.showTooltip(e, item));
        element.addEventListener('mouseleave', () => this.hideTooltip());
        element.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleItemClick(item, isEquipped);
        });
    }

    showTooltip(event, item) {
        if (!this.tooltip || !item) return;
        
        const lang = this.game.localization.getCurrentLanguage();
        const rarityData = window.GameConfig.RARITIES[item.rarity];
        
        this.tooltip.innerHTML = `
            <div class="tooltip-content">
                <div class="tooltip-header">
                    <div class="tooltip-name" style="color: ${rarityData.color};">${item.name}</div>
                    <div class="tooltip-type">${window.GameConfig.EQUIPMENT_SLOTS[item.slot]?.name[lang] || ''} • ${rarityData.name[lang]}</div>
                </div>
                <hr class="divider">
                <div class="tooltip-stats">
                    ${Object.entries(item.stats).map(([stat, value]) => value !== 0 ? `<div class="tooltip-stat"><span>${stat.toUpperCase()}:</span><span>${value > 0 ? '+' : ''}${value}</span></div>` : '').join('')}
                </div>
                <div class="tooltip-description">${item.description}</div>
            </div>
        `;
        
        this.tooltip.classList.remove('hidden');
        this.updateTooltipPosition(event);
    }

    hideTooltip() {
        if (this.tooltip) {
            this.tooltip.classList.add('hidden');
        }
    }

    updateTooltipPosition(event) {
        if (!this.tooltip || this.tooltip.classList.contains('hidden')) return;
        
        const rect = this.tooltip.getBoundingClientRect();
        let x = event.clientX + 15;
        let y = event.clientY + 15;
        
        if (x + rect.width > window.innerWidth) x = event.clientX - rect.width - 15;
        if (y + rect.height > window.innerHeight) y = event.clientY - rect.height - 15;
        
        this.tooltip.style.left = `${x}px`;
        this.tooltip.style.top = `${y}px`;
    }

    handleItemClick(item, isEquipped) {
        if (isEquipped) {
            this.unequipItem(item.slot);
        } else {
            this.equipItem(item);
        }
        this.hideTooltip();
    }
};