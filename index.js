require('dotenv').config(); //initialize dotenv
const {
    Client,
    GatewayIntentBits,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder
} = require('discord.js'); //import discord.js


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent
    ]
}); //create new client

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

const btn = new ButtonBuilder()
    .setCustomId("highFiveBtn")
    .setLabel("Give me a high five")
    .setStyle(ButtonStyle.Primary);

const row = new ActionRowBuilder()
    .addComponents(btn)

client.on('messageCreate', msg => {
    const content = msg.content;
    if (content.includes("ugly")) {
        msg.author.send("Thats not allowed to say");
        msg.delete();
    }
    if (msg.content.includes("high five")) {
        msg.author.send({
            content: "I want a high five!!!!",
            components: [row]
        })
        return;
    }
    if (!msg.author.bot && msg.content.includes("$")) {
        msg.author.send(`Echo ${msg.content}`)
    }
});

client.on("interactionCreate", async interaction => {
    console.log(interaction)
    if (interaction.customId === "highFiveBtn") {
        await interaction.reply({
            content: "HIGH FIVE!",
            ephemeral: true
        })
    }
})


//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN);