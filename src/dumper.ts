import axios from 'axios';
import { load } from 'cheerio';
import { writeFileSync } from 'fs'

interface Pokemon {
	englishName: string;
	frenchName: string;
}

async function scrapePokemonNames(): Promise<Pokemon[]> {
	const url = 'https://bulbapedia.bulbagarden.net/wiki/List_of_French_Pok%C3%A9mon_names';
	const response = await axios.get(url);
	const $ = load(response.data);

	const pokemon: Pokemon[] = [];

	$('table.roundy tbody tr').each((i, element) => {
		const englishName = $(element).find('td:nth-child(3) a').text().trim() || $(element).find('td:nth-child(2) a').text().trim();
		const frenchName = $(element).find('td:nth-child(4) a').text().trim() || $(element).find('td:nth-child(3)').text().trim();

		if (englishName && frenchName) {
			pokemon.push({ englishName, frenchName });
		}
	});

	return pokemon;
}

scrapePokemonNames().then((pokemon) => {
	writeFileSync("./src/dumps/translations.json", JSON.stringify(pokemon));
});
