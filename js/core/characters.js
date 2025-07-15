// filename: js/core/characters.js

/**
 * @fileoverview Defines the data structures and base stats for all playable characters.
 * This module centralizes character-related data, making it easy to manage and balance.
 */

/**
 * Character data for all playable heroes in Path of Heroes.
 * @namespace Characters
 */
export const Characters = {
    /**
     * Base stats for the Warrior class (Taha).
     * @property {Object} WARRIOR
     * @property {string} WARRIOR.name - Character's display name.
     * @property {string} WARRIOR.name_ar - Character's display name in Arabic.
     * @property {string} WARRIOR.resource - Primary resource type.
     * @property {string} WARRIOR.role - Combat role.
     * @property {string} WARRIOR.specialization - Key specialization.
     * @property {Object} WARRIOR.baseStats - Initial stats at Level 1.
     * @property {number} WARRIOR.baseStats.hp - Hit Points.
     * @property {number} WARRIOR.baseStats.resource - Resource points.
     * @property {number} WARRIOR.baseStats.atk - Attack power.
     * @property {number} WARRIOR.baseStats.def - Defense.
     * @property {number} WARRIOR.baseStats.spd - Speed (determines initiative).
     * @property {number} WARRIOR.baseStats.crit - Critical hit chance (%).
     */
    WARRIOR: {
        id: 'warrior',
        name: 'Taha',
        name_ar: 'طه',
        resource: 'Vigor',
        resourceIcon: '🟣',
        role: 'Tank / Melee',
        specialization: '🛡️ High DEF, ❤️ High HP',
        description_en: 'A formidable warrior, Taha leads with unyielding defense and immense vitality. He excels in direct combat, soaking up damage while delivering powerful strikes.',
        description_ar: 'محارب هائل، يقود طه بدفاع لا يتزعزع وحيوية هائلة. إنه يتفوق في القتال المباشر، ويمتص الضرر بينما يوجه ضربات قوية.',
        baseStats: {
            hp: 120,
            resource: 60, // Vigor
            atk: 15,
            def: 12,
            spd: 8,
            crit: 10
        }
    },

    /**
     * Base stats for the Sorceress class (Mais).
     * @property {Object} SORCERESS
     */
    SORCERESS: {
        id: 'sorceress',
        name: 'Mais',
        name_ar: 'ميس',
        resource: 'Mana',
        resourceIcon: '🔵',
        role: 'Ranged Mage',
        specialization: '🔮 AoE, ❄️ Crowd Control',
        description_en: 'Mais commands elemental forces, unleashing devastating area-of-effect spells and freezing foes in their tracks. Though fragile, her magic can turn the tide of any battle.',
        description_ar: 'ميس تتحكم بالقوى العنصرية، تطلق تعويذات منطقة واسعة مدمرة وتجمد الأعداء في مساراتهم. على الرغم من ضعفها، يمكن لسحرها تغيير مجرى أي معركة.',
        baseStats: {
            hp: 80,
            resource: 100, // Mana
            atk: 18,
            def: 6,
            spd: 10,
            crit: 12
        }
    },

    /**
     * Base stats for the Rogue class (Ibrahim).
     * @property {Object} ROGUE
     */
    ROGUE: {
        id: 'rogue',
        name: 'Ibrahim',
        name_ar: 'إبراهيم',
        resource: 'Energy',
        resourceIcon: '🟢',
        role: 'Assassin',
        specialization: '⚡ High SPD, 💥 High Crit',
        description_en: 'Swift and deadly, Ibrahim strikes from the shadows with unparalleled speed and precision. His critical hits can dispatch even the toughest enemies before they know what hit them.',
        description_ar: 'سريع وقاتل، يضرب إبراهيم من الظلال بسرعة ودقة لا مثيل لهما. يمكن لضرباته الحاسمة القضاء على أصعب الأعداء قبل أن يدركوا ما أصابهم.',
        baseStats: {
            hp: 100,
            resource: 80, // Energy
            atk: 20,
            def: 8,
            spd: 15,
            crit: 20
        }
    }
};