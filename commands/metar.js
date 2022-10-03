const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("metar")
        .setDescription("Récuperer le metar d'un aéroport")
        .addStringOption((option) =>
            option
                .setName("code_oaci")
                .setDescription("Le code de l'aéroport")
                .setRequired(true)
        ),

    async execute(interaction) {

        const puppeteer = require('puppeteer');

        // On récupère l'argument de la commande ici le code oaci
        const codeOaci = interaction.options.getString("code_oaci");

        let scrape = async () => {
            const browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();

            await page.goto('https://www.getmetar.com/');
            await page.click('.form-control.form-control-lg');
            await page.keyboard.sendCharacter(codeOaci);
            await page.keyboard.press('Enter');
            await page.waitForNavigation();

            try {
                const result = await page.evaluate(() => {

                    let metar = document.querySelector('#page-top > div.bannerHeight > header > div > div > div > h4').innerText;

                    return metar;

                });
                browser.close();
                return `:cloud: <@${interaction.user.id}> **__voici le metar de ${codeOaci.toUpperCase()}__** :cloud:\n> ${result}`;
            } catch (err) {
                if (err) console.error(err);
                browser.close();
                return `:warning: <@${interaction.user.id}> le code ${codeOaci.toUpperCase()} est **__invalide ou innexistant__** dans la base de données :warning:`;
            }
        };

        scrape().then((value) => {
            console.log(value);
            interaction.reply({
                content: value,
            });
        });
    },
};