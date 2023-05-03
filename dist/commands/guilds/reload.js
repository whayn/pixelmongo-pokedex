"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notifier_1 = require("../../utils/notifier");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
module.exports = {
    options: {
        name: "reload",
        description: "Permet de reload les commandes sans avoir à relancer le bot"
    },
    async execute({ client, interaction }) {
        try {
            await interaction.reply("working on it");
            async function compile() {
                const tsc = (0, child_process_1.spawn)("tsc");
                await new Promise((resolve, reject) => {
                    tsc.on("exit", (code) => {
                        if (code === 0) {
                            resolve();
                        }
                        else {
                            reject(`TypeScript compilation failed with exit code ${code}`);
                        }
                    });
                    tsc.on("error", (err) => {
                        reject(`TypeScript compilation failed with error: ${err}`);
                    });
                });
                console.log("TypeScript compilation complete");
            }
            delete client.commands;
            client.commands = {
                global: (0, fs_1.readdirSync)(path_1.default.join(__dirname, "../global/")).map((file) => require(`../global/${file}`)),
                guilds: (0, fs_1.readdirSync)(path_1.default.join(__dirname, "../guilds/")).map((file) => require(`../guilds/${file}`))
            };
            interaction.editReply("All commands reloaded");
        }
        catch (err) {
            interaction.reply(notifier_1.Notifier.error(`Ohoh \n ${err}`));
        }
    }
};
