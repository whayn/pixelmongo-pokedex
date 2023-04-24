import { Events, Client } from "discord.js";
import { Logger } from "../utils/logger";
import { config } from "../config";
import { commands } from "..";

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client: Client) {

		// Command Initialiser
		await client.application?.commands.set(commands.global.map(command => command.options)).then(cmds => {
			Logger.success("Global commands have been loaded");
		});

		await Promise.all(config.guildIds.map(async guildId => {
			const guild = await client.guilds.fetch(guildId);
			if (!guild) return;
			return client.application?.commands.set(commands.guilds.map(command => command.options), guildId)
				.then(cmds => {
					Logger.success(`Commands for ${guild.name} have been loaded`);
				})
		}));

		console.log("\n");
		Logger.success(`[EVENT] Ready! Logged in as ${client.user?.tag}`);

	},
};
