import { CommandInteraction, Client, ApplicationCommandOptionType } from "discord.js";
import admin, { db } from "../lib/firebase";
import { Command } from "../Command";

export const Suggestion: Command = {
    name: "suggestion",
    description: "Adds suggestions to guild suggestions",
    options: [
        {
            name: "text",
            description: "The text to suggest",
            type: ApplicationCommandOptionType.String
        }
    ],
    run: async (client: Client, interaction: CommandInteraction) => {
        const content = `Your suggestion will be taken into consideration.`;
        const text = interaction.options.get("text")?.value;
        if (!text || typeof text !== "string") {
            await interaction.reply({ content: "You must provide text to suggest." });
            return;
        }

        await db.collection("suggestions").add({
            content: text,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            createdBy: {
                id: interaction.user.id,
                username: interaction.user.username,
                discriminator: interaction.user.discriminator
            },
            status: "pending",
            suggestion: text,
            guild: interaction.guildId
        })

        await interaction.reply({
            content,
            ephemeral: true
        });
    }
}; 