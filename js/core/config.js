// js/core/config.js
// Game Configuration
window.GameConfig = {
    VERSION: 'V.3.1.0', // Updated version
    DEBUG_MODE: true,
    MAX_FLOORS: 10,
    SAVE_KEY: 'path_of_heroes_save',
    
    DIFFICULTIES: {
        easy: { playerDmgMult: 1.5, enemyDmgMult: 0.7, xpMult: 2.0, goldMult: 1.5 },
        normal: { playerDmgMult: 1.0, enemyDmgMult: 1.0, xpMult: 1.0, goldMult: 1.0 },
        hard: { playerDmgMult: 0.8, enemyDmgMult: 1.3, xpMult: 0.8, goldMult: 0.8 }
    },

    RARITIES: {
        common: { chance: 50, color: "#95a5a6", statMult: 1.0, name: { en: "Common", ar: "عادي" } },
        uncommon: { chance: 30, color: "#27ae60", statMult: 1.2, name: { en: "Uncommon", ar: "غير عادي" } },
        rare: { chance: 15, color: "#3498db", statMult: 1.5, name: { en: "Rare", ar: "نادر" } },
        epic: { chance: 4, color: "#9b59b6", statMult: 2.0, name: { en: "Epic", ar: "ملحمي" } },
        mythic: { chance: 0.8, color: "#e67e22", statMult: 2.8, name: { en: "Mythic", ar: "أسطوري" } },
        legendary: { chance: 0.2, color: "#f1c40f", statMult: 3.5, name: { en: "Legendary", ar: "خرافي" } }
    },

    EQUIPMENT_SLOTS: {
        head: { name: { en: "Head", ar: "الرأس" }, icon: "🎩" },
        shoulders: { name: { en: "Shoulders", ar: "الأكتاف" }, icon: "🛡️" },
        chest: { name: { en: "Chest", ar: "الصدر" }, icon: "👔" },
        legs: { name: { en: "Legs", ar: "الساقين" }, icon: "👖" },
        feet: { name: { en: "Feet", ar: "القدمين" }, icon: "👢" },
        hands: { name: { en: "Hands", ar: "اليدين" }, icon: "🧤" },
        weapon: { name: { en: "Weapon", ar: "السلاح" }, icon: "⚔️" },
        accessory: { name: { en: "Accessory", ar: "الإكسسوار" }, icon: "💍" }
    },

    ITEM_TYPES: {
        sword: { name: { en: "Sword", ar: "سيف" }, icon: "⚔️", slot: "weapon", baseStats: { attack: 15 }, description: { en: "A trusty blade.", ar: "نصل موثوق."} },
        health_potion: { name: { en: "Health Potion", ar: "جرعة صحة" }, icon: "🧪", slot: null, consumable: true, effect: 'heal_hp', value: 50, description: { en: "Restores 50 health.", ar: "يستعيد 50 من الصحة."} }
    },

    ITEM_PREFIXES: [
        { name: { en: "Cursed", ar: "ملعون" }, statMod: { attack: -2, defense: 2 } },
        { name: { en: "Swift", ar: "سريع" }, statMod: { speed: 3, defense: -1 } }
    ],

    ITEM_SUFFIXES: [
        { name: { en: "of Power", ar: "القوة" }, statMod: { attack: 3 } },
        { name: { en: "of Defense", ar: "الدفاع" }, statMod: { defense: 3 } }
    ],
    
    CHARACTERS: {
        taha: {
            id: 'taha',
            name: { en: "Taha", ar: "طه" },
            title: { en: "Steel Knight", ar: "الفارس الفولاذي" },
            description: { en: "A stalwart defender with unmatched courage.", ar: "مدافع صامد بشجاعة لا تُضاهى." },
            sprite: '🛡️',
            stats: { hp: 120, maxHp: 120, attack: 15, defense: 12, speed: 8, crit: 10 },
            resource: { type: "vigor", name: { en: "Vigor", ar: "قوة" }, current: 25, max: 25, regen: 2 },
            abilities: ["heavy_strike"],
            growthRates: { hp: 8, attack: 2, defense: 2, speed: 1, crit: 1 },
            strengths: {
                s1: { en: "High Defense", ar: "دفاع عالي" },
                s2: { en: "High Health", ar: "صحة عالية" }
            }
        },
        mais: {
            id: 'mais',
            name: { en: "Mais", ar: "ميس" },
            title: { en: "Arcane Weaver", ar: "نساجة السحر" },
            description: { en: "A master of mystical arts and elemental magic.", ar: "سيدة الفنون السحرية والسحر الأولي." },
            sprite: '🔮',
            stats: { hp: 80, maxHp: 80, attack: 20, defense: 8, speed: 12, crit: 15 },
            resource: { type: "mana", name: { en: "Mana", ar: "سحر" }, current: 30, max: 30, regen: 3 },
            abilities: ["fireball"],
            growthRates: { hp: 5, attack: 3, defense: 1, speed: 2, crit: 2 },
            strengths: {
                s1: { en: "Elemental Mastery", ar: "إتقان العناصر" },
                s2: { en: "Crowd Control", ar: "السيطرة على الحشود" }
            }
        },
        ibrahim: {
            id: 'ibrahim',
            name: { en: "Ibrahim", ar: "إبراهيم" },
            title: { en: "Shadow Blade", ar: "نصل الظل" },
            description: { en: "A swift and deadly assassin who strikes from the shadows.", ar: "قاتل سريع ومميت يضرب من الظلال." },
            sprite: '🗡️',
            stats: { hp: 100, maxHp: 100, attack: 18, defense: 10, speed: 15, crit: 20 },
            resource: { type: "energy", name: { en: "Energy", ar: "طاقة" }, current: 20, max: 20, regen: 4 },
            abilities: ["quick_strike"],
            growthRates: { hp: 6, attack: 2.5, defense: 1.5, speed: 2, crit: 2.5 },
            strengths: {
                s1: { en: "High Speed", ar: "سرعة عالية" },
                s2: { en: "High Crit", ar: "ضربة حاسمة عالية" }
            }
        }
    },

    ENEMIES: {
        skeleton_warrior: {
            name: { en: "Skeleton Warrior", ar: "محارب الهيكل العظمي" },
            sprite: "💀",
            baseStats: { hp: 60, attack: 18, defense: 8, speed: 6, crit: 5 },
            xpReward: 25,
            goldReward: 8,
        },
        goblin: {
            name: { en: "Goblin", ar: "عفريت" },
            sprite: "👹",
            baseStats: { hp: 45, attack: 15, defense: 5, speed: 10, crit: 8 },
            xpReward: 20,
            goldReward: 5,
        }
    },

    ABILITIES: {
        heavy_strike: { name: { en: "Heavy Strike", ar: "ضربة ثقيلة" }, cost: 5, damage: 1.5, type: "attack" },
        fireball: { name: { en: "Fireball", ar: "كرة النار" }, cost: 6, damage: 1.3, type: "attack" },
        quick_strike: { name: { en: "Quick Strike", ar: "ضربة سريعة" }, cost: 4, damage: 1.2, critBonus: 25, type: "attack" }
    },

    XP_CURVE: { baseXP: 100, increment: 50, maxLevel: 20 },
    COMBAT: { baseCritMultiplier: 2.0, fleeChance: 0.7 },
    INVENTORY: { maxSlots: 40, startingGold: 50 }
};