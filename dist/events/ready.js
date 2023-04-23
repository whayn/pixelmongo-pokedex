"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const logger_1 = require("../utils/logger");
module.exports = {
    name: discord_js_1.Events.ClientReady,
    once: true,
    execute(client) {
        logger_1.Logger.success(`[EVENT] Ready! Logged in as ${client.user?.tag}`);
    },
};
