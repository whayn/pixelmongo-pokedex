import Fuse from "fuse.js"
import translations from '../dumps/translations.json'

export function autoCorrect(pokemon: string): { correctedPokemon: string, language: "fr" | "en" } | undefined {
	const combinedNames: readonly string[] = [...(new Set(
		translations.flatMap(pokemon => [pokemon.englishName, pokemon.frenchName])
	))];
	const mappedTranslations = new Fuse(combinedNames);
	const frenchResults = mappedTranslations.search(pokemon);
	if (frenchResults.length === 0) {
		return undefined;
	}
	const correctedPokemon = frenchResults[0].item;
	const language = translations.find(tr => tr.frenchName === correctedPokemon) ? 'fr' : 'en';
	return { correctedPokemon, language };
}


export function pokeTranslator(pokemon: string, language: "fr" | "en"): string | undefined {
	const searchKey = language === "fr" ? "frenchName" : "englishName";
	const oppositeKey = language === "fr" ? "englishName" : "frenchName"
	const translatedName = translations.find((tr) => tr[searchKey].toLowerCase() === pokemon.toLowerCase())?.[oppositeKey];
	return translatedName;
}

console.log(pokeTranslator("Salameche", "fr"))