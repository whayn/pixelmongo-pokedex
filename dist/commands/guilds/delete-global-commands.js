"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notifier_1 = require("../../utils/notifier");
module.exports = {
    options: {
        name: "delete-global-commands",
        description: "Supprime les commandes globales du bot"
    },
    async execute({ client, interaction }) {
        try {
            interaction.reply(notifier_1.Notifier.info("Suppression en cours"));
            await client.application?.commands.set([]);
            interaction.editReply(notifier_1.Notifier.info("Done"));
        }
        catch (err) {
            interaction.reply(notifier_1.Notifier.error(`Ohoh \n ${err}`));
        }
    }
};
