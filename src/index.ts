import { Client, GatewayIntentBits, Events, Partials } from "discord.js";
import * as path from "path";
import { readdirSync, existsSync } from "fs";
import { Logger } from "./utils/logger";
import 'dotenv/config'
import { config } from "./config";

declare module 'discord.js' {
	interface Client {
		commands: { global: any[]; guilds: any[] };
	}
}

export const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = {
	global: readdirSync(path.join(__dirname, "./commands/global/")).map(
		(file) => require(`./commands/global/${file}`),
	),
	guilds: readdirSync("./dist/commands/guilds").map(
		(file) => require(`./commands/guilds/${file}`)
	)
};

// Event Loader
Logger.info("Loading events\n\n###############\n");

readdirSync("./dist/events")
	.filter((file: string) => (file.endsWith(".js")))
	.forEach((file: string) => {
		Logger.info(`[Events] Attempting to load event ${file}`);
		try {
			// eslint-disable-next-line import/no-dynamic-require, global-require
			if (!existsSync(`./dist/events/${file}`))
				throw new Error(`./dist/events/${file} does not exist`);
			const event = require(`./events/${file}`);
			if (!event.once) {
				client.on(file.replace('.js', ''), (...args) => event.execute(client, args));
				Logger.success(`[Events] Successfully loaded ${file} (on)`);
			} else {
				client.once(file.replace('.js', ''), (...args) => event.execute(client, args));
				Logger.success(`[Events] Successfully loaded ${file} (once)`);
			}
		} catch (err) {
			Logger.error(`[Events] Unable to load event ${file}:\n${err}\n`);
		}
	});

Logger.success("All events have been loaded\n\n###############\n");


client.login(config.token);
