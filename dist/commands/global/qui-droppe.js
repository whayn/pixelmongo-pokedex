"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wiki_scraper_1 = require("../../utils/wiki-scraper");
const logger_1 = require("../../utils/logger");
const utils_1 = require("../../utils/utils");
const utils_2 = require("../../utils/utils");
const notifier_1 = require("../../utils/notifier");
module.exports = {
    options: {
        name: "qui-drope",
        description: "Donne la liste des pokémons dropant une ressource donnée et leur point d'apparition",
        options: [
            { type: 3, name: "ressource", description: "Le nom de la ressource sur minecraft (ex : minecraft:blaze_rod)", required: true }
        ]
    },
    async execute({ client, interaction }) {
        try {
            await interaction.reply({ content: "Récupération des données" });
            const ressource = interaction.options.get('ressource')?.value?.toString() || "minecraft:dirt";
            const { pokemons, drop } = await (0, wiki_scraper_1.getPokemonForDrops)(ressource || "minecraft:dirt");
            if (!pokemons[0])
                return interaction.editReply(notifier_1.Notifier.error(`Aucun pokemon ne droppe : \`${ressource}\` (ex: minecraft:dirt)`));
            const formatedPokemons = [];
            let i = 0;
            interaction.editReply({ content: `Récupération des données ${i}/${pokemons.length}` });
            for (const poke of pokemons) {
                i++;
                let pokemon = {
                    name: poke.pokemon,
                    drop: utils_2.pokeTranslator.drop(poke.dropType),
                    spawns: []
                };
                try {
                    const pokeSpawns = await (0, wiki_scraper_1.getPokeSpawns)(poke.pokemon);
                    for (const spawn of pokeSpawns) {
                        const spawnData = {
                            biome: spawn.biome,
                            modID: spawn.modID,
                            time: spawn.time,
                            location: spawn.location,
                            condition: spawn.condition,
                            rarity: spawn.rarity
                        };
                        pokemon.spawns.push(spawnData);
                    }
                }
                catch (err) {
                    logger_1.Logger.error(`Error while getting spawns for ${poke.pokemon}: ${err}`);
                }
                if (pokemon.spawns[0])
                    formatedPokemons.push(pokemon);
                interaction.editReply({ content: `Récupération des données ${i}/${pokemons.length}` });
            }
            if (!formatedPokemons[0])
                return interaction.editReply(notifier_1.Notifier.error(`Aucun pokemon non légendaire ne droppe : \`${ressource}\` (ex: minecraft:dirt)`));
            const researchResultsEmbed = (0, utils_1.createShortSearchresult)(formatedPokemons, drop, client);
            interaction.editReply(researchResultsEmbed);
        }
        catch (error) {
            if (error?.code && error?.message) {
                logger_1.Logger.error(`[Pokesearch] Error Occured\n${error.code}\n`);
                interaction.editReply(notifier_1.Notifier.error(error.message));
            }
            else {
                logger_1.Logger.error(`[Pokesearch] Error Occured\n${error}\n`);
                logger_1.Logger.webhooks.error(error, interaction.commandName);
                interaction.editReply(notifier_1.Notifier.error("Une erreur est survenue :/"));
            }
        }
    }
};
