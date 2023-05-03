"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const discord_js_1 = require("discord.js");
const path = __importStar(require("path"));
const fs_1 = require("fs");
const logger_1 = require("./utils/logger");
require("dotenv/config");
const config_1 = require("./config");
exports.client = new discord_js_1.Client({ intents: [discord_js_1.GatewayIntentBits.Guilds] });
exports.client.commands = {
    global: (0, fs_1.readdirSync)(path.join(__dirname, "./commands/global/")).map((file) => require(`./commands/global/${file}`)),
    guilds: (0, fs_1.readdirSync)("./dist/commands/guilds").map((file) => require(`./commands/guilds/${file}`))
};
// Event Loader
logger_1.Logger.info("Loading events\n\n###############\n");
(0, fs_1.readdirSync)("./dist/events")
    .filter((file) => (file.endsWith(".js")))
    .forEach((file) => {
    logger_1.Logger.info(`[Events] Attempting to load event ${file}`);
    try {
        // eslint-disable-next-line import/no-dynamic-require, global-require
        if (!(0, fs_1.existsSync)(`./dist/events/${file}`))
            throw new Error(`./dist/events/${file} does not exist`);
        const event = require(`./events/${file}`);
        if (!event.once) {
            exports.client.on(file.replace('.js', ''), (...args) => event.execute(exports.client, args));
            logger_1.Logger.success(`[Events] Successfully loaded ${file} (on)`);
        }
        else {
            exports.client.once(file.replace('.js', ''), (...args) => event.execute(exports.client, args));
            logger_1.Logger.success(`[Events] Successfully loaded ${file} (once)`);
        }
    }
    catch (err) {
        logger_1.Logger.error(`[Events] Unable to load event ${file}:\n${err}\n`);
    }
});
logger_1.Logger.success("All events have been loaded\n\n###############\n");
exports.client.login(config_1.config.token);
