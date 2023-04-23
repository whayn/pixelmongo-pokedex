import { EmbedData, APIEmbed, HexColorString, Message } from "discord.js";
import translations from '../dumps/translations.json'
import { Client } from "discord.js";
import { config } from "../config";

interface RessourceData {
	name: string;
	drop: string;
	spawns: {
		biome: string;
		time: string;
		location: string;
		condition: string;
		rarity: string;
	}[];
}

interface pokeEmbed {
	title: string,
	description?: string,
	color?: number | undefined,
	fields?: {
		name: string,
		value: string,
		inline?: Boolean
	}[]
}


export function createSearchResult(data: Array<RessourceData>, ressource: string | number | undefined, client: Client) {
	const owneruser = client.users.cache.get(config.owner)
	let message = {
		content: "",
		embeds: [{
			"title": `Informations sur: ${ressource}`,
			"description": "Cette ressource est disponible en tuant les pokémons suivants:",
			"color": 0xFF0000,
		}] as APIEmbed[]
	}
	data.forEach((pokemon, i) => {
		let pokeEmbed = {
			"title": `${pokeTranslator.toFrench(pokemon.name) || pokemon.name} (${pokemon.drop})`,
			"color": 0xFF0000,
			"fields": pokemon.spawns.map(spawn => {
				return {
					name: spawn.biome,
					value: `**Rareté :** ${spawn.rarity}\n**Conditions :** ${spawn.condition}\n**Endroit :** ${spawn.location}\n**Moment :** ${spawn.time}`,
					inline: true
				}
			}),
			"footer": (i + 1 == data.length) ? {
				"text": `Fait par ${owneruser?.tag || "Whayn#2400"}`,
				"icon_url": owneruser?.displayAvatarURL({ size: 512 })
			} : undefined
		}
		message.embeds.push(pokeEmbed)
	})
	if (message.embeds.length > 10) {
		const shorter = createShortSearchresult(data, ressource, client)
		shorter.content = "Le message à été réduit à cause d'une trop grande quantité de résultats"
		return shorter
	}
	return message
}

export function createShortSearchresult(data: Array<RessourceData>, ressource: string | number | undefined, client: Client) {
	{
		const owneruser = client.users.cache.get(config.owner)
		let message = {
			content: "",
			embeds: [{
				"title": `Informations sur: ${ressource}`,
				"description": "Cette ressource est disponible en tuant les pokémons suivants:",
				"color": 0xFF0000,
				"fields": [],
				"footer": {
					"text": `Fait par ${owneruser?.tag || "Whayn#2400"}`,
					"icon_url": owneruser?.displayAvatarURL({ size: 512 })
				}
			}] as APIEmbed[]
		}
		data.forEach((pokemon) => {
			let pokeField = {
				"name": `${pokeTranslator.toFrench(pokemon.name) || pokemon.name} (${pokemon.drop}):`,
				"value": [... new Set(pokemon.spawns.map(spawn => spawn.biome))].join(", "),
				"inline": true
			}
			message.embeds[0].fields?.push(pokeField)
		})
		return message
	}
}

export const pokeTranslator = {
	drop: (drop: string | undefined): string => {
		switch (drop) {
			case "maindropdata":
				return "100%"

			case "raredropdata":
				return "5%"

			case "optdrop1data":
				return "100%"

			case "optdrop2data":
				return "100%"

			default:
				return "0% (oopsie)"
		}
	},
	toFrench: (name: string): string | undefined => {
		return translations.find(tr => tr.englishName.toLowerCase() == name.toLowerCase())?.frenchName
	}
}