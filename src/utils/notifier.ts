import { config } from "../config"

export const Notifier = {
	error: (message: string, ephemeral: boolean = false) => {
		return {
			embeds: [{
				"title": "❌ Une erreur s'est produite",
				"description": message,
				"color": config.colors.red
			}]
		}
	},
	warning: (message: string, ephemeral: boolean = false) => {
		return {
			embeds: [{
				"title": "⚠️ Attention !",
				"description": message,
				"color": config.colors.yellow
			}]
		}
	},
	info: (message: string, ephemeral: boolean = false) => {
		return {
			embeds: [{
				"title": "ℹ️ Information",
				"description": message,
				"color": config.colors.blue
			}]
		}
	},
}