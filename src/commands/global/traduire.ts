import { Client, CommandInteraction, ApplicationCommandData, CommandInteractionOption } from 'discord.js'
import { Logger } from '../../utils/logger'
import { Notifier } from '../../utils/notifier'
import { autoCorrect, pokeTranslator } from '../../utils/translator'
import { config } from '../../config'

module.exports = {
	options: {
		name: "traduire",
		description: "Traduit le nom d'un pokemon de l'anglais au français et vice-versa, parce que c'est chiant l'anglais",
		options: [
			{ type: 3, name: "pokemon", description: "Le nom du pokemon que tu veux traduire", required: true },
		]
	},
	async execute({ client, interaction }: { client: Client, interaction: CommandInteraction }) {
		try {
			const optionPokemon = interaction.options.get("pokemon")?.value as string;
			const autoCorrectResult = autoCorrect(optionPokemon);
			if (!autoCorrectResult) return interaction.reply(Notifier.error(`Impossible de trouver un pokémon du nom de : \`${optionPokemon}\``, true));


			const { correctedPokemon, language } = autoCorrectResult;
			const translatedPoke = pokeTranslator(correctedPokemon, language);

			if (!translatedPoke) return Notifier.error(`Aucune traduction trouvée pour : \`${optionPokemon}\``, true);


			const typedCorrectly = correctedPokemon.toLowerCase() !== optionPokemon.toLowerCase()
				? `Résultats pour ${correctedPokemon} (aucun résultats trouvé pour ${optionPokemon})\n`
				: "";

			interaction.reply({
				embeds: [{
					title: `Traductions pour ${optionPokemon}`,
					color: config.colors.red,
					description: `${typedCorrectly}\`\`\`\n${translatedPoke}\`\`\``,
					//thumbnail: { url: "https://cdn.discordapp.com/attachments/893131089688805406/1100356531616227388/1c42c07d-c320-49d9-b49c-48a367ab301c.jpg" }
				}]
			});


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