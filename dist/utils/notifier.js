"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notifier = void 0;
const config_1 = require("../config");
exports.Notifier = {
    error: (message) => {
        return {
            embeds: [{
                    "title": "❌ Une erreur s'est produite",
                    "description": message,
                    "color": config_1.config.colors.red
                }]
        };
    },
    warning: (message) => {
        return {
            embeds: [{
                    "title": "⚠️ Attention !",
                    "description": message,
                    "color": config_1.config.colors.yellow
                }]
        };
    },
    info: (message) => {
        return {
            embeds: [{
                    "title": "ℹ️ Information",
                    "description": message,
                    "color": config_1.config.colors.blue
                }]
        };
    },
};
