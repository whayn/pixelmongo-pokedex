import { Events, Client } from "discord.js";
import { Logger } from "../utils/logger";

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client: Client) {
		Logger.success(`[EVENT] Ready! Logged in as ${client.user?.tag}`);
	},
};
