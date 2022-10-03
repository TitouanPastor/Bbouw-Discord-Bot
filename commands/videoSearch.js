const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("video")
        .setDescription("Trouver une vidéo de la chaîne")
        .addStringOption((option) =>
            option
                .setName("mots_cles")
                .setDescription("Mots clés de la vidéo")
                .setRequired(true)
        ),

    async execute(interaction) {
        const tags = interaction.options.getString("mots_cles");
        let response = await fetch('https://www.googleapis.com/youtube/v3/search?key=AIzaSyCfcUzxpe-6Zlk9vrkLInsSBz3_kR91Y9w&channelId=UCbzMX4a96lKepwFvGaQf5CQ&type=video&q=' + tags + '&maxResults=1');
        let data = await response.json();
        data = data.items;
        console.log(data);
        for (video in data) {
            interaction.reply({
                content: `<@${interaction.user.id}> voici la vidéo que j'ai trouvé : \n> https://www.youtube.com/watch?v=${data[video].id.videoId}`,
            });
        }
    }
};