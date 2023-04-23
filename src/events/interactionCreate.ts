import { Events, Interaction, Client, BaseInteraction } from "discord.js";
import { readdirSync } from "fs";
import * as path from "path";
import { commands } from "../index";
import { config } from '../config'


module.exports = {
	once: false,
	execute(client: Client, [interaction]: [interaction: BaseInteraction]) {
		if (interaction.isCommand()) {
			const { commandName, guildId } = interaction

			//			const guild_commands = commands.guilds.find(({ id }) => id === guildId)
			const table = config.guildIds.includes(guildId as string) ? [...commands.global, ...commands.guilds] : commands.global

			const command = table.find(({ options }) => options.name == commandName)

			command ? command.execute({ client, interaction }) : interaction.reply({ content: 'La commande est indisponible.', ephemeral: true })

		}
	}
}
