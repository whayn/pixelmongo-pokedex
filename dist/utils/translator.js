"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pokeTranslator = exports.autoCorrect = void 0;
const fuse_js_1 = __importDefault(require("fuse.js"));
const translations_json_1 = __importDefault(require("../dumps/translations.json"));
function autoCorrect(pokemon) {
    const combinedNames = [...(new Set(translations_json_1.default.flatMap(pokemon => [pokemon.englishName, pokemon.frenchName])))];
    const mappedTranslations = new fuse_js_1.default(combinedNames);
    const frenchResults = mappedTranslations.search(pokemon);
    if (frenchResults.length === 0) {
        return undefined;
    }
    const correctedPokemon = frenchResults[0].item;
    const language = translations_json_1.default.find(tr => tr.frenchName === correctedPokemon) ? 'fr' : 'en';
    return { correctedPokemon, language };
}
exports.autoCorrect = autoCorrect;
function pokeTranslator(pokemon, language) {
    const searchKey = language === "fr" ? "frenchName" : "englishName";
    const oppositeKey = language === "fr" ? "englishName" : "frenchName";
    const translatedName = translations_json_1.default.find((tr) => tr[searchKey].toLowerCase() === pokemon.toLowerCase())?.[oppositeKey];
    return translatedName;
}
exports.pokeTranslator = pokeTranslator;
console.log(pokeTranslator("Salameche", "fr"));
