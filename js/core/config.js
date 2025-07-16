// filename: js/core/config.js

/**
 * @fileoverview Global configuration settings for the Path of Heroes game.
 * This file defines constants and configurations that control various aspects
 * of the game, such as debug mode, game version, and difficulty multipliers.
 */

/**
 * GameConfig object holds all global configuration settings.
 * @namespace GameConfig
 */
export const GameConfig = {
    DEBUG_MODE: true,
    GAME_VERSION: "V.37.30",
    LOADING_DURATION_MS: 1000,

    SCREENS: {
        'intro': {
            html: 'screens/intro.html',
            js: 'js/screens/intro.js'
        },
        'character-select': {
            html: 'screens/character-select.html',
            js: 'js/screens/character-select.js'
        },
        'battle': {
            html: 'screens/battle.html',
            js: 'js/screens/battle.js'
        }
    },

    DEFAULT_LANGUAGE: 'en',
    AUTOSAVE_FLOORS: [1, 5, 10],

    INVENTORY: {
        startingGold: 50,
        maxSlots: 20,
    },

    RARITIES: {
        common: { name: { en: 'Common', ar: 'شائع' }, chance: 60, statMult: 1.0, color: '#95a5a6' },
        uncommon: { name: { en: 'Uncommon', ar: 'غير شائع' }, chance: 25, statMult: 1.2, color: '#27ae60' },
        rare: { name: { en: 'Rare', ar: 'نادر' }, chance: 10, statMult: 1.5, color: '#3498db' },
        epic: { name: { en: 'Epic', ar: 'ملحمي' }, chance: 4, statMult: 1.9, color: '#9b59b6' },
        mythic: { name: { en: 'Mythic', ar: 'أسطوري' }, chance: 0.8, statMult: 2.4, color: '#e67e22' },
        legendary: { name: { en: 'Legendary', ar: 'خارق' }, chance: 0.2, statMult: 3.0, color: '#f1c40f' },
    },

    EQUIPMENT_SLOTS: {
        weapon: { name: { en: 'Weapon', ar: 'سلاح' }, icon: '⚔️' },
        head: { name: { en: 'Head', ar: 'رأس' }, icon: '👑' },
        chest: { name: { en: 'Chest', ar: 'صدر' }, icon: '👕' },
    },

    ITEM_TYPES: {
        // Weapons
        sword: {
            name: { en: 'Sword', ar: 'سيف' }, slot: 'weapon', icon: '🗡️',
            baseStats: { atk: 5 }
        },
        staff: {
            name: { en: 'Staff', ar: 'عصا' }, slot: 'weapon', icon: '🪄',
            baseStats: { atk: 7 }
        },
        // Consumables
        hp_potion: {
            name: { en: 'Health Potion', ar: 'جرعة صحة' }, slot: null, icon: '❤️‍🩹', consumable: true,
            effect: 'heal_hp', value: 25, description: { en: 'Restores a small amount of health.', ar: 'يستعيد كمية صغيرة من الصحة.' }
        }
    },

    ITEM_PREFIXES: [
        { name: { en: 'Sturdy', ar: 'متين' }, statMod: { def: 2 } },
        { name: { en: 'Sharp', ar: 'حاد' }, statMod: { atk: 2 } },
    ],
    ITEM_SUFFIXES: [
        { name: { en: 'of Speed', ar: 'السرعة' }, statMod: { spd: 1 } },
        { name: { en: 'of Power', ar: 'القوة' }, statMod: { atk: 1, def: 1 } },
    ],

    COMBAT: {
        baseCritMultiplier: 1.5,
        fleeChance: 0.5,
    },

    ABILITIES: {
        'power_strike': {
            name: { en: 'Power Strike', ar: 'ضربة قوية' }, cost: 10,
            type: 'attack', damage: 1.5
        }
    },

    DIFFICULTIES: {
        'easy': { enemyHp: 1.0, enemyAtk: 1.0, xpGain: 1.0, goldGain: 1.0, playerDmgMult: 1.0, enemyDmgMult: 0.8 },
        'normal': { enemyHp: 1.2, enemyAtk: 1.2, xpGain: 1.1, goldGain: 1.1, playerDmgMult: 1.0, enemyDmgMult: 1.0 },
        'hard': { enemyHp: 1.5, enemyAtk: 1.5, xpGain: 1.2, goldGain: 1.2, playerDmgMult: 0.9, enemyDmgMult: 1.2 }
    },

};