// js/core/localization.js
// Localization System
window.Localization = {
    currentLanguage: 'en',
    
    strings: {
        "game.title": { en: "Path of Heroes", ar: "طريق الأبطال" },
        "loading.text": { en: "Loading...", ar: "جاري التحميل..." },
        "loading.systems": { en: "Initializing systems...", ar: "تهيئة الأنظمة..." },
        "loading.data": { en: "Loading game data...", ar: "تحميل بيانات اللعبة..." },
        "loading.roster": { en: "Assembling heroes...", ar: "تجميع الأبطال..." },
        "loading.finalizing": { en: "Finalizing...", ar: "وضع اللمسات الأخيرة..." },
        "menu.new_game": { en: "New Game", ar: "لعبة جديدة" },
        "menu.load_game": { en: "Load Game", ar: "تحميل لعبة" },
        "menu.options": { en: "Options", ar: "الخيارات" },
        "menu.back": { en: "Back", ar: "العودة" },
        "character.select_title": { en: "Choose Your Hero", ar: "اختر بطلك" },
        "character.start_journey": { en: "Start Journey", ar: "ابدأ الرحلة" },
        "character.base_stats": { en: "Base Stats", ar: "الإحصائيات الأساسية" }, // <-- ADDED THIS LINE
        "hud.floor": { en: "Floor", ar: "الطابق" },
        "hud.gold": { en: "Gold", ar: "ذهب" },
        "hud.level": { en: "Level", ar: "المستوى" },
        "hud.inventory": { en: "Inventory", ar: "المخزون" },
        "hud.pause": { en: "Menu", ar: "القائمة" },
        "battle.attack": { en: "Attack", ar: "هجوم" },
        "battle.skill": { en: "Skill", ar: "مهارة" },
        "battle.defend": { en: "Defend", ar: "دفاع" },
        "battle.flee": { en: "Flee", ar: "هروب" },
        "battle.item": { en: "Item", ar: "عنصر" },
        "battle.victory": { en: "Victory!", ar: "انتصار!" },
        "battle.defeat": { en: "Defeat!", ar: "هزيمة!" },
        "battle.your_turn": { en: "Your Turn", ar: "دورك" },
        "battle.enemy_turn": { en: "Enemy Turn", ar: "دور العدو" },
        "levelup.health": { en: "Health", ar: "الصحة" },
        "levelup.attack": { en: "Attack", ar: "الهجوم" },
        "levelup.defense": { en: "Defense", ar: "الدفاع" },
        "levelup.speed": { en: "Speed", ar: "السرعة" },
        "stat.hp": { en: "HP", ar: "صحة" },
        "stat.atk": { en: "ATK", ar: "هجوم" },
        "stat.def": { en: "DEF", ar: "دفاع" },
        "stat.spd": { en: "SPD", ar: "سرعة" },
        "stat.crit": { en: "CRIT", ar: "حاسم" },
        "inventory.title": { en: "Inventory & Equipment", ar: "المخزون والمعدات" },
        "inventory.equipment": { en: "Equipment", ar: "المعدات" },
        "inventory.items": { en: "Items", ar: "العناصر" },
        "inventory.stats": { en: "Character Stats", ar: "إحصائيات الشخصية" },
        "inventory.sort": { en: "Sort Items", ar: "ترتيب العناصر" },
        "inventory.sell_common": { en: "Sell Common", ar: "بيع العادي" },
        "inventory.equip": { en: "Equip", ar: "تجهيز" },
        "inventory.unequip": { en: "Unequip", ar: "إزالة التجهيز" },
        "inventory.sell": { en: "Sell", ar: "بيع" },
        "inventory.empty_slot": { en: "Empty", ar: "فارغ" },
        "ui.colon": { en: ":", ar: ":" },
        "ui.vs": { en: "VS", ar: "ضد" }
    },

    init() {
        this.loadSavedLanguage();
        this.updateAllText();
    },

    loadSavedLanguage() {
        const saved = localStorage.getItem('poh_language');
        if (saved && (saved === 'en' || saved === 'ar')) {
            this.currentLanguage = saved;
        }
        this.applyLanguageDirection();
    },

    getText(key) {
        const entry = this.strings[key];
        if (entry && entry[this.currentLanguage]) {
            return entry[this.currentLanguage];
        }
        return key;
    },

    switchLanguage(lang) {
        if (lang !== 'en' && lang !== 'ar') return;
        
        this.currentLanguage = lang;
        localStorage.setItem('poh_language', lang);
        
        this.applyLanguageDirection();
    },

    applyLanguageDirection() {
        const html = document.documentElement;
        
        if (this.currentLanguage === 'ar') {
            html.setAttribute('dir', 'rtl');
            html.setAttribute('lang', 'ar');
        } else {
            html.setAttribute('dir', 'ltr');
            html.setAttribute('lang', 'en');
        }
    },

    updateAllText() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.getText(key);
        });
    },

    getCharacterName(char) {
        return char.name[this.currentLanguage] || char.name.en;
    },

    getCurrentLanguage() {
        return this.currentLanguage;
    }
};