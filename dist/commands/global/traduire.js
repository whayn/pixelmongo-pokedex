"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../../utils/logger");
const utils_1 = require("../../utils/utils");
const notifier_1 = require("../../utils/notifier");
module.exports = {
    options: {
        name: "traduire",
        description: "Traduit le nom d'un pokemon de l'anglais au français , parce que c'est chiant l'anglais",
        options: [
            { type: 3, name: "pokemon", description: "Le nom du pokemon que tu veux traduire", required: true }
        ]
    },
    async execute({ client, interaction }) {
        try {
            const traduction = utils_1.pokeTranslator.toFrench(interaction.options.get('pokemon')?.value);
            if (traduction) {
                return interaction.reply(traduction);
            }
            else {
                return notifier_1.Notifier.error("Aucune traduction trouvée");
            }
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
