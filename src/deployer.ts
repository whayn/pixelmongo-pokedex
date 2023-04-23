import { config } from "./config";
import { publishSlashCommands } from "./utils/deploy";
import { commands } from "./index";
import { Logger } from "./utils/logger";

const { clientId, token, guildIds } = config
const globalCommands = commands.global.map(cmd => cmd.options)
const guildsCommands = commands.guilds.map(cmd => cmd.options) as any


(async () => {
	try {
		await publishSlashCommands("global", clientId, config.token as string, globalCommands)
		await publishSlashCommands("guilds", clientId, config.token as string, guildsCommands, guildIds)
		Logger.success(`[Deployement] Deployment successful`)
	} catch (error) {
		Logger.error(`[Deployement] An error occured during the deployement\n${error}\n`)
	}

})()

