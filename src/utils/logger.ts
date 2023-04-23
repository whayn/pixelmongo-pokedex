import { WebhookClient } from "discord.js";
import { config } from "../config";


export const Logger = {
	success: (message: string) => {
		console.log(
			`\x1b[32m${new Date().toLocaleString()} [SUCCESS]\x1b[0m ${message}`,
		); // Green
	},

	info: (message: string) => {
		console.log(
			`\x1b[36m${new Date().toLocaleString()} [INFO]\x1b[0m ${message}`,
		); // Cyan
	},

	warn: (message: string) => {
		console.warn(
			`\x1b[33m${new Date().toLocaleString()} [WARN]\x1b[0m ${message}`,
		); // Orange or yellow
	},

	error: (message: string) => {
		console.error(
			`\x1b[31m${new Date().toLocaleString()} [ERROR]\x1b[0m ${message}`,
		); // Red
	},
	webhooks: {
		error: (message: any, command: string) => {
			try {
				const hookClient = new WebhookClient({ url: config.webhooks.error })

				hookClient.send({
					"embeds": [
						{
							"title": "An Error Occured",
							"description": `[Click to see full error](https://pterodactyl.skynhost.com/server/691d6f8f)\n\`\`\`ts${message}\n\n\`\`\`\nCommand : ${command}`,
							"color": 16711680,
							"timestamp": new Date().toISOString()
						}
					],
					"username": "Pixelmongo Pokedex Logger",
					"avatarURL": "https://cdn.discordapp.com/avatars/1095643521727348896/e616a2d973a6e53c8f6cf090f82852df.webp"
				})
			} catch (error) {
				return
			}
		}
	}
}
