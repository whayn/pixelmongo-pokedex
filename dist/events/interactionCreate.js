"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const config_1 = require("../config");
module.exports = {
    once: false,
    execute(client, [interaction]) {
        if (interaction.isCommand()) {
            const { commandName, guildId } = interaction;
            //			const guild_commands = commands.guilds.find(({ id }) => id === guildId)
            const table = config_1.config.guildIds.includes(guildId) ? [...index_1.commands.global, ...index_1.commands.guilds] : index_1.commands.global;
            const command = table.find(({ options }) => options.name == commandName);
            command ? command.execute({ client, interaction }) : interaction.reply({ content: 'La commande est indisponible.', ephemeral: true });
        }
    }
};
