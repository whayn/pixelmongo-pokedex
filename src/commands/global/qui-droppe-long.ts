import { Client, CommandInteraction, ApplicationCommandData, CommandInteractionOption } from 'discord.js'
import { ExportCommand } from '../../types/interaction'
import { getPokemonForDrops, getPokeSpawns } from '../../utils/wiki-scraper'
import { Logger } from '../../utils/logger'
import { createSearchResult, createShortSearchresult } from '../../utils/utils'
import { pokeTranslator } from '../../utils/utils'
import { Notifier } from '../../utils/notifier'

module.exports = {
	options: {
		name: "qui-drope-long",
		description: "Pareil à qui-droppe mais avec bien plus de détails ! Produit un très gros message !",
		options: [
			{ type: 3, name: "ressource", description: "Le nom de la ressource sur minecraft (ex : minecraft:blaze_rod)", required: true }
		]
	},
	async execute({ client, interaction }: { client: Client, interaction: CommandInteraction }) {
		try {
			await interaction.reply({ content: "Récupération des données" })
			const ressource = interaction.options.get('ressource')?.value?.toString() || "minecraft:dirt"
			const { pokemons, drop } = getPokemonForDrops(ressource || "minecraft:dirt")

			if (!pokemons[0]) return interaction.editReply(Notifier.error(`Aucun pokemon ne droppe : \`${ressource}\` (ex: minecraft:dirt)`))

			const formatedPokemons = [];
			let i = 0

			interaction.editReply({ content: `Récupération des données ${i}/${pokemons.length}` })

			for (const poke of pokemons) {
				i++
				let pokemon = {
					name: poke.pokemon,
					drop: pokeTranslator.drop(poke.dropType),
					spawns: [] as any
				}
				try {
					const pokeSpawns = await getPokeSpawns(poke.pokemon);
					for (const spawn of pokeSpawns) {
						const spawnData = {
							biome: spawn.biome,
							modID: spawn.modID,
							time: spawn.time,
							location: spawn.location,
							condition: spawn.condition,
							rarity: spawn.rarity
						}

						pokemon.spawns.push(spawnData);
					}
				} catch (err) {
					Logger.error(`Error while getting spawns for ${poke.pokemon}: ${err}`);
				}
				if (pokemon.spawns[0]) formatedPokemons.push(pokemon)
				interaction.editReply({ content: `Récupération des données ${i}/${pokemons.length}` })
			}

			if (!formatedPokemons[0]) return interaction.editReply(Notifier.error(`Aucun pokemon non légendaire ne droppe : \`${ressource}\` (ex: minecraft:dirt)`))

			const researchResultsEmbed = createSearchResult(formatedPokemons, drop, client)
			interaction.editReply(researchResultsEmbed)
		} catch (error: any) {
			if (error?.code && error?.message) {
				Logger.error(`[Pokesearch] Error Occured\n${error.code}\n`)
				interaction.editReply(Notifier.error(error.message))
			} else {
				Logger.error(`[Pokesearch] Error Occured\n${error}\n`)
				interaction.editReply(Notifier.error("Une erreur est survenue :/"))
			}
		}

	}
}