const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("metarapi")
        .setDescription("Récuperer le metar d'un aéroport avec API")
        .addStringOption((option) =>
            option
                .setName("code_oaci")
                .setDescription("Le code de l'aéroport")
                .setRequired(true)
        ),

    async execute(interaction) {

        // On récupère l'argument de la commande ici le code oaci
        const codeOaci = interaction.options.getString("code_oaci");

        let contentReply;

        axios.get(`https://api.checkwx.com/metar/${codeOaci}?x-api-key=82d09db246ab465396185ec97b`).then(resp => {
            console.log(resp);
            console.log(resp.status);

            if (resp.status === 200 && resp.data.data != "") {
                contentReply = `:cloud: <@${interaction.user.id}> **__voici le metar de ${codeOaci.toUpperCase()}__** :cloud:\n> ${resp.data.data}`;
            } else {
                contentReply = `:warning: <@${interaction.user.id}> le code ${codeOaci.toUpperCase()} est **__invalide ou innexistant__** dans la base de données :warning:`;
            }

            interaction.reply({
                content: contentReply,
            });
        });
    },
};