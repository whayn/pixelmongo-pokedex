import { config } from "./config";
import { publishSlashCommands } from "./utils/deploy";
import { Logger } from "./utils/logger";
import { client } from './index'

const { clientId, token, guildIds } = config
const globalCommands = client.commands.global.map(cmd => cmd.options)
const guildsCommands = client.commands.guilds.map(cmd => cmd.options) as any


(async () => {
	try {
		await publishSlashCommands("global", clientId, config.token as string, globalCommands)
		await publishSlashCommands("guilds", clientId, config.token as string, guildsCommands, guildIds)
		Logger.success(`[Deployement] Deployment successful`)
	} catch (error) {
		Logger.error(`[Deployement] An error occured during the deployement\n${error}\n`)
	}

})()

