"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const logger_1 = require("../utils/logger");
const config_1 = require("../config");
const __1 = require("..");
module.exports = {
    name: discord_js_1.Events.ClientReady,
    once: true,
    async execute(client) {
        // Command Initialiser
        await client.application?.commands.set(__1.commands.global.map(command => command.options)).then(cmds => {
            logger_1.Logger.success("Global commands have been loaded");
        });
        await Promise.all(config_1.config.guildIds.map(async (guildId) => {
            const guild = await client.guilds.fetch(guildId);
            if (!guild)
                return;
            return client.application?.commands.set(__1.commands.guilds.map(command => command.options), guildId)
                .then(cmds => {
                logger_1.Logger.success(`Commands for ${guild.name} have been loaded`);
            });
        }));
        console.log("\n");
        logger_1.Logger.success(`[EVENT] Ready! Logged in as ${client.user?.tag}`);
    },
};
