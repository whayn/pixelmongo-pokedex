"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = require("cheerio");
const fs_1 = require("fs");
async function scrapePokemonNames() {
    const url = 'https://bulbapedia.bulbagarden.net/wiki/List_of_French_Pok%C3%A9mon_names';
    const response = await axios_1.default.get(url);
    const $ = (0, cheerio_1.load)(response.data);
    const pokemon = [];
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
    (0, fs_1.writeFileSync)("./src/dumps/translations.json", JSON.stringify(pokemon));
});
