import { REST, Routes } from 'discord.js';
import { Logger } from './logger';
import 'dotenv/config'

export async function publishSlashCommands(scope: "guilds" | "global", clientId: string, bot_token: string, commands: any, guildIds?: string[]) {
	// Construct and prepare an instance of the REST module
	const rest = new REST().setToken(bot_token);
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);
		let stats = {
			guilds: 0,
			commands: 0
		}
		if (scope == "guilds") {
			if (!guildIds) return Logger.error(`[Deployement] No guild Ids to which publish the commands are specified:\n`)

			// The put method is used to fully refresh all commands in the guild with the current set
			guildIds.forEach(async guildId => {
				await rest.put(
					Routes.applicationGuildCommands(clientId, guildId),
					{ body: commands },
				);
				stats.guilds++
				stats.commands = stats.commands + commands.length
			})

			console.log(`Successfully reloaded ${stats.commands} application (/) commands onto ${stats.guilds} guilds.`);
		} else if (scope == "global") {
			// The put method is used to fully refresh all commands in the guild with the current set
			const data = await rest.put(
				Routes.applicationCommands(clientId),
				{ body: commands },
			);

			console.log(`Successfully reloaded ${commands.length} application (/) commands.`);
		}

	} catch (error) {
		// And of course, make sure you catch and log any errors!
		Logger.error(`[Deployement] An error occured whilst publishing the commands:\n${error}\n`)
	}
}
