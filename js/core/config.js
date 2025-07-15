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
    /**
     * @property {boolean} DEBUG_MODE - If true, enables the debugger panel and console logging.
     * Set to false for production builds.
     */
    DEBUG_MODE: true,

    /**
     * @property {string} GAME_VERSION - The current version of the game.
     * Used for tracking and display purposes.
     */
    GAME_VERSION: "V.37.11", // Updated version

    /**
     * @property {number} LOADING_DURATION_MS - Duration of the loading screen animation in milliseconds.
     * Set to 0 to skip the loading screen.
     */
    LOADING_DURATION_MS: 1500,

    /**
     * @property {Object.<string, Object.<string, string>>} SCREENS - Defines paths for game screens.
     * Each screen has its HTML and JS path.
     */
    SCREENS: {
        'intro': {
            html: 'screens/intro.html',
            js: 'js/screens/intro.js'
        },
        // Add other screens here as they are implemented
        // 'character-select': { html: 'screens/character-select.html', js: 'js/screens/character-select.js' },
        // 'battle': { html: 'screens/battle.html', js: 'js/screens/battle.js' },
        // 'shop': { html: 'screens/shop.html', js: 'js/screens/shop.js' },
        // 'shrine': { html: 'screens/shrine.html', js: 'js/screens/shrine.js' },
        // 'campfire': { html: 'screens/campfire.html', js: 'js/screens/campfire.js' },
        // 'game-over': { html: 'screens/game-over.html', js: 'js/screens/game-over.js' }
    },

    /**
     * @property {Object.<string, Object.<string, number>>} DIFFICULTIES - Multipliers for enemy stats and rewards.
     * Scales with floor number.
     * (Placeholder, will be expanded)
     */
    DIFFICULTIES: {
        'easy': { enemyHp: 1.0, enemyAtk: 1.0, xpGain: 1.0, goldGain: 1.0 },
        'normal': { enemyHp: 1.2, enemyAtk: 1.2, xpGain: 1.1, goldGain: 1.1 },
        'hard': { enemyHp: 1.5, enemyAtk: 1.5, xpGain: 1.2, goldGain: 1.2 }
    },

    /**
     * @property {string} DEFAULT_LANGUAGE - The default language for the game. 'en' for English, 'ar' for Arabic.
     */
    DEFAULT_LANGUAGE: 'en',

    /**
     * @property {number} AUTOSAVE_FLOORS - Floors at which the game automatically saves.
     * (Placeholder, will be used with GameState and Save/Load)
     */
    AUTOSAVE_FLOORS: [1, 5, 10],

    // Add more configuration settings as needed (e.g., character stats, item properties)
};