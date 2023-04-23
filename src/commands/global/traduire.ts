import { Client, CommandInteraction, ApplicationCommandData, CommandInteractionOption } from 'discord.js'
import { ExportCommand } from '../../types/interaction'
import { getPokemonForDrops, getPokeSpawns } from '../../utils/wiki-scraper'
import { Logger } from '../../utils/logger'
import { createSearchResult, createShortSearchresult } from '../../utils/utils'
import { pokeTranslator } from '../../utils/utils'
import { Notifier } from '../../utils/notifier'

module.exports = {
	options: {
		name: "traduire",
		description: "Traduit le nom d'un pokemon de l'anglais au français , parce que c'est chiant l'anglais",
		options: [
			{ type: 3, name: "pokemon", description: "Le nom du pokemon que tu veux traduire", required: true }
		]
	},
	async execute({ client, interaction }: { client: Client, interaction: CommandInteraction }) {
		try {
			const traduction = pokeTranslator.toFrench(interaction.options.get('pokemon')?.value as string)
			if (traduction) { return interaction.reply(traduction) } else {
				return Notifier.error("Aucune traduction trouvée")
			}
		} catch (error: any) {
			if (error?.code && error?.message) {
				Logger.error(`[Pokesearch] Error Occured\n${error.code}\n`)
				interaction.editReply(Notifier.error(error.message))
			} else {
				Logger.error(`[Pokesearch] Error Occured\n${error}\n`)
				Logger.webhooks.error(error, interaction.commandName)
				interaction.editReply(Notifier.error("Une erreur est survenue :/"))
			}
		}

	}
}