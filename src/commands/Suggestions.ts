import {
    Client,
    codeBlock,
    CommandInteraction,
    MessageFlags,
    PermissionsBitField,
} from 'discord.js';
import { Command } from 'src/Command';
import { db } from '../lib/firebase';

export const Suggestions: Command = {
    name: 'suggestions',
    description: 'Returns all suggestions',
    defaultMemberPermissions: [PermissionsBitField.Flags.Administrator],
    run: async (client: Client, interaction: CommandInteraction) => {
        const ownerRole = interaction.memberPermissions?.has(
            PermissionsBitField.Flags.Administrator
        );
        if (!ownerRole) {
            await interaction.user.send({
                content: "You don't have permissions to this command",
            });
            await interaction.deleteReply();
            return;
        }
        const suggestions = await getSuggestions(interaction.guildId!);
        if (!suggestions) {
            await interaction.followUp({
                content: 'An error has occurred',
            });
            return;
        }
        const suggestionsArray = suggestions.docs.map(
            (s) => s.data().suggestion
        );
        console.log(suggestionsArray);
        await interaction.user.send({
            content: `Here are all the suggestions: ${codeBlock(
                'json',
                JSON.stringify(suggestionsArray, null, 2)
            )}`,
            flags: [64],
        });
        await interaction.followUp("I've sent you a DM.");
    },
};

const getSuggestions = async (id: string) => {
    try {
        const suggestions = await db
            .collection('suggestions')
            .where("guild", "==", id)
            .orderBy('suggestion', 'desc')
            .get();
        return suggestions;
    } catch (error) {
        console.log(error);
        return null;
    }
}