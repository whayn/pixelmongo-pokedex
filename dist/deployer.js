"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const deploy_1 = require("./utils/deploy");
const index_1 = require("./index");
const logger_1 = require("./utils/logger");
const { clientId, token, guildIds } = config_1.config;
const globalCommands = index_1.commands.global.map(cmd => cmd.options);
const guildsCommands = index_1.commands.guilds.map(cmd => cmd.options);
(async () => {
    try {
        await (0, deploy_1.publishSlashCommands)("global", clientId, config_1.config.token, globalCommands);
        await (0, deploy_1.publishSlashCommands)("guilds", clientId, config_1.config.token, guildsCommands, guildIds);
        logger_1.Logger.success(`[Deployement] Deployment successful`);
    }
    catch (error) {
        logger_1.Logger.error(`[Deployement] An error occured during the deployement\n${error}\n`);
    }
})();
