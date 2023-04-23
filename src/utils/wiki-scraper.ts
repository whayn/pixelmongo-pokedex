import axios from 'axios';
import { load } from 'cheerio';
import drops from "../dumps/pokedrops.json";
import Fuse from 'fuse.js';

const pokedrops: PokeDrop[] = drops

interface Item {
	name: string;
	dropChance: string;
	quantity: string;
}

interface Spawn {
	biome: string;
	modID: string;
	time: string;
	location: string;
	condition: string;
	rarity: string;
}

interface PokeDrop {
	pokemon: string;
	maindropdata: string;
	maindropmin: number;
	maindropmax: number;
	optdrop1data?: string;
	optdrop1min?: number;
	optdrop1max?: number;
	optdrop2data?: string;
	optdrop2min?: number;
	optdrop2max?: number;
	raredropdata?: string;
	raredropmin?: number;
	raredropmax?: number;
}

interface PokeDrops {
	pokemon: string;
	dropType: string;
	drop: string | number | unknown;
}

interface FilteredPokeDrops {
	pokemons: PokeDrops[];
	drop: string | number | undefined;
}



const errorMessages = {
	incorrect_poke: "Le pokemon spécifié est introuvable.",
	unexpected_poke: "Une erreur est survenue."
}


export async function getPokeDrops(pokemon: string): Promise<Item[]> {
	try {
		const url = `https://pixelmonmod.com/wiki/${pokemon}`;
		const page = await axios.get(url)
		if (page.status == 404) throw { code: "incorrect_poke", message: errorMessages.incorrect_poke }
		const html = page.data;
		const $ = load(html);

		const items: Item[] = [];

		$('.wikitable.sortable tbody tr')
			.each((i, el) => {
				const tds = $(el).find('td');
				const name = $(tds[0]).find('a').last().text();
				const dropChance = $(tds[1]).text().trim();
				const quantity = $(tds[2]).text().trim();

				const item: Item = { name, dropChance, quantity };
				item.name != '' ? items.push(item) : ""
			});
		if (!items[0]) throw { code: "incorrect_poke", message: errorMessages.incorrect_poke }
		return items
	} catch (error) {
		throw { code: "unexpected_poke", message: errorMessages.unexpected_poke }
	}
}

export async function getPokeSpawns(pokemon: string): Promise<Spawn[]> {
	try {
		const url = `https://pixelmonmod.com/wiki/${pokemon}`;
		const page = await axios.get(url)
		if (page.status == 404) throw { code: "incorrect_poke", message: errorMessages.incorrect_poke }
		const html = page.data;
		const $ = load(html);

		let rows;
		if ($('.tabber .tabberlive')[0]) {
			rows = $('.tabber .tabberlive .tabbertab[title="Standard"] table.roundy[style*="width: 55%;height:25px"] .roundytop tbody tr')
		} else {
			rows = $('table.roundy[style*="width: 55%;height:25px"] .roundytop tbody tr');
		}

		let spawns: Spawn[] = []

		rows.each((index, element) => {
			const columns = $(element).find('td');
			const biome = $(columns[0]).text().trim();
			const modID = $(columns[1]).text().trim();
			const time = $(columns[2]).text().trim();
			const location = $(columns[3]).text().trim();
			const condition = $(columns[4]).text().trim();
			const rarity = $(columns[5]).text().trim();
			if (biome) {
				spawns.push({ biome, modID, time, location, condition, rarity });

			}
		}
		);
		if (!spawns[0]) throw { code: "incorrect_poke", message: errorMessages.incorrect_poke }
		return spawns.slice(0, -1)
	} catch (error) {
		throw { code: "unexpected_poke", message: errorMessages.unexpected_poke }
	}
}

export function getPokemonForDrops(search: string): { pokemons: PokeDrops[]; drop: string | number | undefined } {
	const possibleDrops = [...new Set(pokedrops.flatMap((pokemon) =>
		["maindropdata", "raredropdata", "optdrop1data", "optdrop2data"]
			.map((dropType: any) => (
				pokemon[dropType as keyof PokeDrop] || undefined
			))).filter(drop => drop !== undefined))]

	const fuse = new Fuse(possibleDrops)
	const drop = fuse.search(search)[0].item


	return {
		pokemons: pokedrops.flatMap((pokemon) =>
			["maindropdata", "raredropdata", "optdrop1data", "optdrop2data"]
				.map((dropType: any) => ({
					pokemon: pokemon.pokemon,
					dropType,
					drop: pokemon[dropType as keyof PokeDrop]
				}))
		).filter((pokemonDrop) => pokemonDrop.drop === drop),
		drop: drop
	}

}
