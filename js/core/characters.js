// filename: js/core/characters.js
export const Characters = {
    WARRIOR: {
        id: 'warrior',
        name: 'Taha',
        name_ar: 'طه',
        resource: 'Vigor',
        resourceIcon: '🟣',
        role: 'Tank / Melee',
        role_ar: 'دبابة / قتال قريب',
        specialization: '🛡️ High DEF, ❤️ High HP',
        traits: ['highDefenseTrait', 'resoluteTrait', 'areaStrikesTrait'],
        description_en: "A formidable warrior, Taha leads with unyielding defense and immense vitality.",
        description_ar: "محارب هائل، يقود طه بدفاع لا يتزعزع وحيوية هائلة.",
        baseStats: { hp: 120, resource: 60, atk: 15, def: 12, spd: 8, crit: 10 },
        growthRates: { hp: 10, atk: 2, def: 3, spd: 0.5, crit: 0.2 }
    },
    SORCERESS: {
        id: 'sorceress',
        name: 'Mais',
        name_ar: 'ميس',
        resource: 'Mana',
        resourceIcon: '🔵',
        role: 'Ranged Mage',
        role_ar: 'ساحرة بعيدة المدى',
        specialization: '🔮 AoE, ❄️ Crowd Control',
        traits: ['elementalMagicTrait', 'spellMasteryTrait', 'ancientKnowledgeTrait'],
        description_en: "Mais commands elemental forces, unleashing devastating area-of-effect spells.",
        description_ar: "ميس تتحكم بالقوى العنصرية، تطلق تعويذات منطقة واسعة مدمرة.",
        baseStats: { hp: 80, resource: 100, atk: 18, def: 6, spd: 10, crit: 12 },
        growthRates: { hp: 6, atk: 3, def: 1, spd: 1, crit: 0.5 }
    },
    ROGUE: {
        id: 'rogue',
        name: 'Ibrahim',
        name_ar: 'إبراهيم',
        resource: 'Energy',
        resourceIcon: '🟢',
        role: 'Assassin',
        role_ar: 'قاتل',
        specialization: '⚡ High SPD, 💥 High Crit',
        traits: ['berserkerRageTrait', 'rawStrengthTrait', 'intimidatingTrait'],
        description_en: "Swift and deadly, Ibrahim strikes from the shadows with unparalleled speed and precision.",
        description_ar: "سريع وقاتل، يضرب إبراهيم من الظلال بسرعة ودقة لا مثيل لهما.",
        baseStats: { hp: 100, resource: 80, atk: 20, def: 8, spd: 15, crit: 20 },
        growthRates: { hp: 8, atk: 2.5, def: 2, spd: 1.5, crit: 1 }
    }
};