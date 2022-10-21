import * as dotenv from "dotenv";
import { Client } from "discord.js";
import ready from "./ready";
import interactionCreate from "./interactionCreate";
import { createSpinner } from "nanospinner";
dotenv.config();

console.clear();

const spinner = createSpinner("Starting bot...").start();;

const client = new Client({
    intents: []
});

ready(client, (c) => spinner.success({
    text: `Bot started as ${c.user?.username}#${c.user?.discriminator}`,

}));
interactionCreate(client);

client.login(process.env.CLIENT_TOKEN)