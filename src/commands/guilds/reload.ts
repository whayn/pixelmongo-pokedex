import { Client, CommandInteraction } from 'discord.js'
import { Notifier } from '../../utils/notifier'
import { readdirSync } from 'fs'
import path from 'path'
import { spawn } from 'child_process'

module.exports = {
	options: {
		name: "reload",
		description: "Permet de reload les commandes sans avoir à relancer le bot"
	},
	async execute({ client, interaction }: { client: Client, interaction: CommandInteraction }) {
		try {
			await interaction.reply("working on it")
			async function compile() {
				const tsc = spawn("tsc");
				await new Promise<void>((resolve, reject) => {
					tsc.on("exit", (code) => {
						if (code === 0) {
							resolve();
						} else {
							reject(`TypeScript compilation failed with exit code ${code}`);
						}
					});
					tsc.on("error", (err) => {
						reject(`TypeScript compilation failed with error: ${err}`);
					});
				});
				console.log("TypeScript compilation complete");
			}


			delete (client as any).commands
			client.commands = {
				global: readdirSync(path.join(__dirname, "../global/")).map(
					(file) => require(`../global/${file}`),
				),
				guilds: readdirSync(path.join(__dirname, "../guilds/")).map(
					(file) => require(`../guilds/${file}`)
				)
			};
			interaction.editReply("All commands reloaded")
		} catch (err) {
			interaction.reply(Notifier.error(`Ohoh \n ${err}`))
		}
	}
}