"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
module.exports = {
    once: false,
    execute(client, [interaction]) {
        if (interaction.isCommand()) {
            const { commandName, guildId } = interaction;
            //			const guild_commands = commands.guilds.find(({ id }) => id === guildId)
            const table = config_1.config.guildIds.includes(guildId) ? [...client.commands.global, ...client.commands.guilds] : client.commands.global;
            const command = table.find(({ options }) => options.name == commandName);
            command ? command.execute({ client, interaction }) : interaction.reply({ content: 'La commande est indisponible.', ephemeral: true });
        }
    }
};
