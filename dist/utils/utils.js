"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pokeTranslator = exports.createShortSearchresult = exports.createSearchResult = void 0;
const translations_json_1 = __importDefault(require("../dumps/translations.json"));
const config_1 = require("../config");
function createSearchResult(data, ressource, client) {
    const owneruser = client.users.cache.get(config_1.config.owner);
    let message = {
        content: "",
        embeds: [{
                "title": `Informations sur: ${ressource}`,
                "description": "Cette ressource est disponible en tuant les pokémons suivants:",
                "color": 0xFF0000,
            }]
    };
    data.forEach((pokemon, i) => {
        let pokeEmbed = {
            "title": `${exports.pokeTranslator.toFrench(pokemon.name) || pokemon.name} (${pokemon.drop})`,
            "color": 0xFF0000,
            "fields": pokemon.spawns.map(spawn => {
                return {
                    name: spawn.biome,
                    value: `**Rareté :** ${spawn.rarity}\n**Conditions :** ${spawn.condition}\n**Endroit :** ${spawn.location}\n**Moment :** ${spawn.time}`,
                    inline: true
                };
            }),
            "footer": (i + 1 == data.length) ? {
                "text": `Fait par ${owneruser?.tag || "Whayn#2400"}`,
                "icon_url": owneruser?.displayAvatarURL({ size: 512 })
            } : undefined
        };
        message.embeds.push(pokeEmbed);
    });
    if (message.embeds.length > 10) {
        const shorter = createShortSearchresult(data, ressource, client);
        shorter.content = "Le message à été réduit à cause d'une trop grande quantité de résultats";
        return shorter;
    }
    return message;
}
exports.createSearchResult = createSearchResult;
function createShortSearchresult(data, ressource, client) {
    {
        const owneruser = client.users.cache.get(config_1.config.owner);
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
                }]
        };
        data.forEach((pokemon) => {
            let pokeField = {
                "name": `${exports.pokeTranslator.toFrench(pokemon.name) || pokemon.name} (${pokemon.drop}):`,
                "value": [...new Set(pokemon.spawns.map(spawn => spawn.biome))].join(", "),
                "inline": true
            };
            message.embeds[0].fields?.push(pokeField);
        });
        return message;
    }
}
exports.createShortSearchresult = createShortSearchresult;
exports.pokeTranslator = {
    drop: (drop) => {
        switch (drop) {
            case "maindropdata":
                return "100%";
            case "raredropdata":
                return "5%";
            case "optdrop1data":
                return "100%";
            case "optdrop2data":
                return "100%";
            default:
                return "0% (oopsie)";
        }
    },
    toFrench: (name) => {
        return translations_json_1.default.find(tr => tr.englishName.toLowerCase() == name.toLowerCase())?.frenchName;
    }
};
