"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishSlashCommands = void 0;
const discord_js_1 = require("discord.js");
const logger_1 = require("./logger");
require("dotenv/config");
async function publishSlashCommands(scope, clientId, bot_token, commands, guildIds) {
    // Construct and prepare an instance of the REST module
    const rest = new discord_js_1.REST().setToken(bot_token);
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        let stats = {
            guilds: 0,
            commands: 0
        };
        if (scope == "guilds") {
            if (!guildIds)
                return logger_1.Logger.error(`[Deployement] No guild Ids to which publish the commands are specified:\n`);
            // The put method is used to fully refresh all commands in the guild with the current set
            guildIds.forEach(async (guildId) => {
                await rest.put(discord_js_1.Routes.applicationGuildCommands(clientId, guildId), { body: commands });
                stats.guilds++;
                stats.commands = stats.commands + commands.length;
            });
            console.log(`Successfully reloaded ${stats.commands} application (/) commands onto ${stats.guilds} guilds.`);
        }
        else if (scope == "global") {
            // The put method is used to fully refresh all commands in the guild with the current set
            const data = await rest.put(discord_js_1.Routes.applicationCommands(clientId), { body: commands });
            console.log(`Successfully reloaded ${commands.length} application (/) commands.`);
        }
    }
    catch (error) {
        // And of course, make sure you catch and log any errors!
        logger_1.Logger.error(`[Deployement] An error occured whilst publishing the commands:\n${error}\n`);
    }
}
exports.publishSlashCommands = publishSlashCommands;
