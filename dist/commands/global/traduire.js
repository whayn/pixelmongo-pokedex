"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../../utils/logger");
const notifier_1 = require("../../utils/notifier");
const translator_1 = require("../../utils/translator");
const config_1 = require("../../config");
module.exports = {
    options: {
        name: "traduire",
        description: "Traduit le nom d'un pokemon de l'anglais au français et vice-versa, parce que c'est chiant l'anglais",
        options: [
            { type: 3, name: "pokemon", description: "Le nom du pokemon que tu veux traduire", required: true },
        ]
    },
    async execute({ client, interaction }) {
        try {
            const optionPokemon = interaction.options.get("pokemon")?.value;
            const autoCorrectResult = (0, translator_1.autoCorrect)(optionPokemon);
            if (!autoCorrectResult)
                return interaction.reply(notifier_1.Notifier.error(`Impossible de trouver un pokémon du nom de : \`${optionPokemon}\``, true));
            const { correctedPokemon, language } = autoCorrectResult;
            const translatedPoke = (0, translator_1.pokeTranslator)(correctedPokemon, language);
            if (!translatedPoke)
                return notifier_1.Notifier.error(`Aucune traduction trouvée pour : \`${optionPokemon}\``, true);
            const typedCorrectly = correctedPokemon.toLowerCase() !== optionPokemon.toLowerCase()
                ? `Résultats pour ${correctedPokemon} (aucun résultats trouvé pour ${optionPokemon})\n`
                : "";
            interaction.reply({
                embeds: [{
                        title: `Traductions pour ${optionPokemon}`,
                        color: config_1.config.colors.red,
                        description: `${typedCorrectly}\`\`\`\n${translatedPoke}\`\`\``,
                        //thumbnail: { url: "https://cdn.discordapp.com/attachments/893131089688805406/1100356531616227388/1c42c07d-c320-49d9-b49c-48a367ab301c.jpg" }
                    }]
            });
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
