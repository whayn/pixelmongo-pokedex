import { Client, CommandInteraction } from 'discord.js'
import { Notifier } from '../../utils/notifier'

module.exports = {
	options: {
		name: "delete-global-commands",
		description: "Supprime les commandes globales du bot"
	},
	async execute({ client, interaction }: { client: Client, interaction: CommandInteraction }) {
		try {
			interaction.reply(Notifier.info("Suppression en cours"))
			await client.application?.commands.set([])
			interaction.editReply(Notifier.info("Done"))
		} catch (err) {
			interaction.reply(Notifier.error(`Ohoh \n ${err}`))
		}
	}
}