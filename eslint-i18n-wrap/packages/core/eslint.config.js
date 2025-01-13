// eslint.config.js
"use strict";

// Import the ESLint plugin locally
import eslintPluginWrap from './index.js'

export default [
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
        },
        // Using the eslint-plugin-example plugin defined locally
        plugins: {"i18n-wrap": eslintPluginWrap},
        rules: {
            "i18n-wrap/wrap-t-function": "error",
        },
    }
]
