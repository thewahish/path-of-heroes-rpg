// filename: js/core/localization.js

/**
 * @fileoverview Handles dynamic English/Arabic text switching for the game.
 * This class manages the current language, provides translations, and updates
 * UI elements with the correct localized text.
 */

/**
 * Localization class for managing game text in multiple languages.
 * @class
 */
export class Localization {
    /**
     * @private
     * @type {string}
     * The currently active language ('en' for English, 'ar' for Arabic).
     */
    #currentLanguage;

    /**
     * @private
     * @type {Object.<string, Object.<string, string>>}
     * A dictionary containing all localized strings.
     */
    #translations = {
        'en': {
            // Global UI
            loadingText: "Loading Path of Heroes...",
            floorLabel: "Floor:",
            goldLabel: "Gold:",
            inventoryButton: "Inventory",
            debuggerTitle: "Debugger",
            gameStateTitle: "Game State",
            consoleLogTitle: "Console Log",
            copyLogsButton: "Copy All Logs",

            // Intro Screen
            gameTitle: "Path of Heroes",
            playButton: "Play Game",
            optionsButton: "Options",
            creditsButton: "Credits",

            // Debug messages
            debugInitialized: "Debugger initialized.",
            debugToggleOn: "Debugger panel opened.",
            debugToggleOff: "Debugger panel closed.",
            debugLogsCopied: "All logs copied to clipboard!",
            errorLoadingScreen: "Error loading screen: ",
            screenLoaded: "Screen loaded: ",
            gameInitialized: "Game initialized.",
            languageChangedTo: "Language changed to: ",
            errorCopyingLogs: "Failed to copy logs: ",
            errorInitializingSystem: "Error initializing system: ",
            systemInitialized: "System initialized: ",
        },
        'ar': {
            // Global UI
            loadingText: "جاري تحميل طريق الأبطال...",
            floorLabel: "الطابق:",
            goldLabel: "الذهب:",
            inventoryButton: "المخزون",
            debuggerTitle: "المصحح",
            gameStateTitle: "حالة اللعبة",
            consoleLogTitle: "سجل وحدة التحكم",
            copyLogsButton: "نسخ جميع السجلات",

            // Intro Screen
            gameTitle: "طريق الأبطال",
            playButton: "ابدأ اللعبة",
            optionsButton: "الخيارات",
            creditsButton: "الاعتمادات",

            // Debug messages
            debugInitialized: "تم تهيئة المصحح.",
            debugToggleOn: "لوحة المصحح مفتوحة.",
            debugToggleOff: "لوحة المصحح مغلقة.",
            debugLogsCopied: "تم نسخ جميع السجلات إلى الحافظة!",
            errorLoadingScreen: "خطأ في تحميل الشاشة: ",
            screenLoaded: "تم تحميل الشاشة: ",
            gameInitialized: "تم تهيئة اللعبة.",
            languageChangedTo: "تم تغيير اللغة إلى: ",
            errorCopyingLogs: "فشل نسخ السجلات: ",
            errorInitializingSystem: "خطأ في تهيئة النظام: ",
            systemInitialized: "تم تهيئة النظام: ",
        }
    };

    /**
     * Creates an instance of Localization.
     * @param {string} defaultLanguage - The initial language for the game.
     */
    constructor(defaultLanguage) {
        this.#currentLanguage = defaultLanguage;
        console.log(`Localization system initialized with default language: ${this.#currentLanguage}`);
    }

    /**
     * Gets the translation for a given key in the current language.
     * @param {string} key - The key for the desired translation string.
     * @returns {string} The translated string, or the key itself if no translation is found.
     */
    get(key) {
        return this.#translations[this.#currentLanguage][key] || key;
    }

    /**
     * Sets the current language and updates all elements with a 'data-localize' attribute.
     * Also updates the 'dir' attribute on the <html> tag for RTL support.
     * @param {string} language - The language to set ('en' or 'ar').
     */
    setLanguage(language) {
        if (this.#translations[language]) {
            this.#currentLanguage = language;
            document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
            this.updateLocalizedElements();
            console.log(this.get('languageChangedTo') + language);
        } else {
            console.warn(`Language '${language}' not supported.`);
        }
    }

    /**
     * Gets the current active language.
     * @returns {string} The current language ('en' or 'ar').
     */
    getCurrentLanguage() {
        return this.#currentLanguage;
    }

    /**
     * Iterates through all elements with a 'data-localize' attribute and updates their text content.
     */
    updateLocalizedElements() {
        document.querySelectorAll('[data-localize]').forEach(element => {
            const key = element.getAttribute('data-localize');
            element.textContent = this.get(key);
        });
        // Update language toggle button text based on current language
        const langToggleButton = document.getElementById('language-toggle');
        if (langToggleButton) {
            langToggleButton.textContent = this.#currentLanguage === 'en' ? 'عربي' : 'English';
        }
    }
}