"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPokemonForDrops = exports.getPokeSpawns = exports.getPokeDrops = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = require("cheerio");
const pokedrops_json_1 = __importDefault(require("../dumps/pokedrops.json"));
const fuse_js_1 = __importDefault(require("fuse.js"));
const pokedrops = pokedrops_json_1.default;
const errorMessages = {
    incorrect_poke: "Le pokemon spécifié est introuvable.",
    unexpected_poke: "Une erreur est survenue.",
    no_results: "Aucun drop ne correspond à"
};
async function getPokeDrops(pokemon) {
    try {
        const url = `https://pixelmonmod.com/wiki/${pokemon}`;
        const page = await axios_1.default.get(url);
        if (page.status == 404)
            throw { code: "incorrect_poke", message: errorMessages.incorrect_poke };
        const html = page.data;
        const $ = (0, cheerio_1.load)(html);
        const items = [];
        $('.wikitable.sortable tbody tr')
            .each((i, el) => {
            const tds = $(el).find('td');
            const name = $(tds[0]).find('a').last().text();
            const dropChance = $(tds[1]).text().trim();
            const quantity = $(tds[2]).text().trim();
            const item = { name, dropChance, quantity };
            item.name != '' ? items.push(item) : "";
        });
        if (!items[0])
            throw { code: "incorrect_poke", message: errorMessages.incorrect_poke };
        return items;
    }
    catch (error) {
        throw { code: "unexpected_poke", message: errorMessages.unexpected_poke };
    }
}
exports.getPokeDrops = getPokeDrops;
async function getPokeSpawns(pokemon) {
    try {
        const url = `https://pixelmonmod.com/wiki/${pokemon}`;
        const page = await axios_1.default.get(url);
        if (page.status == 404)
            throw { code: "incorrect_poke", message: errorMessages.incorrect_poke };
        const html = page.data;
        const $ = (0, cheerio_1.load)(html);
        let rows;
        if ($('.tabber .tabberlive')[0]) {
            rows = $('.tabber .tabberlive .tabbertab[title="Standard"] table.roundy[style*="width: 55%;height:25px"] .roundytop tbody tr');
        }
        else {
            rows = $('table.roundy[style*="width: 55%;height:25px"] .roundytop tbody tr');
        }
        let spawns = [];
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
        });
        if (!spawns[0])
            throw { code: "incorrect_poke", message: errorMessages.incorrect_poke };
        return spawns.slice(0, -1);
    }
    catch (error) {
        throw { code: "unexpected_poke", message: errorMessages.unexpected_poke };
    }
}
exports.getPokeSpawns = getPokeSpawns;
async function getPokemonForDrops(search) {
    const possibleDrops = [...new Set(pokedrops.flatMap((pokemon) => ["maindropdata", "raredropdata", "optdrop1data", "optdrop2data"]
            .map((dropType) => (pokemon[dropType] || undefined))).filter(drop => drop !== undefined))];
    const fuse = new fuse_js_1.default(possibleDrops);
    const research = fuse.search(search);
    if (research.length === 0)
        throw { code: "no_results", message: `${errorMessages.no_results} ${search}` };
    const drop = research[0].item;
    return {
        pokemons: pokedrops.flatMap((pokemon) => ["maindropdata", "raredropdata", "optdrop1data", "optdrop2data"]
            .map((dropType) => ({
            pokemon: pokemon.pokemon,
            dropType,
            drop: pokemon[dropType]
        }))).filter((pokemonDrop) => pokemonDrop.drop === drop),
        drop: drop
    };
}
exports.getPokemonForDrops = getPokemonForDrops;
