import { ActionRowBuilder, Interaction, PermissionsBitField, SelectMenuBuilder, SelectMenuComponent } from "discord.js";
import { Command } from "src/Command";
import { getSuggestions } from "./Suggestions";
import { db } from "../lib/firebase";


export const RemoveSuggestion: Command = {
    name: "remove-suggestion",
    description: "Removes a suggestion",
    defaultMemberPermissions: [PermissionsBitField.Flags.Administrator],
    run: async (client, interaction) => {
        if (!interaction.guildId || interaction.user.bot) return;
        const suggestions = await getSuggestions(interaction.guildId, true);
        if (!suggestions) {
            await interaction.followUp({
                content: "An error has occurred",
            });
            return;
        }
        const row = new ActionRowBuilder()
            .addComponents(
                new SelectMenuBuilder()
                    .setCustomId('remove-suggestion')
                    .setPlaceholder('Nothing selected')
                    .addOptions(
                        suggestions.map((s) => ({
                            label: s.suggestion,
                            value: s.id
                        }))
                    ));


        await interaction.followUp({
            content: "Select a suggestion to remove",
            components: [row as any],
            ephemeral: true,
        });
    }
}

export const handleRemoveSuggestion = async (value: string) => {
    try {
        await db.collection("suggestions").doc(value).delete();
    } catch (e) {
        console.error("Error removing suggestion", e);
    }
}