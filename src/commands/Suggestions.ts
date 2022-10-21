import {
    Client,
    codeBlock,
    CommandInteraction,
    MessageFlags,
    PermissionsBitField,
} from 'discord.js';
import { stringify } from 'querystring';
import { Command } from 'src/Command';
import { db } from '../lib/firebase';

export const Suggestions: Command = {
    name: 'suggestions',
    description: 'Returns all suggestions',
    defaultMemberPermissions: [PermissionsBitField.Flags.Administrator],
    run: async (client: Client, interaction: CommandInteraction) => {
        if (!interaction.guildId) {
            await interaction.followUp({ content: 'An error has occurred' });
            return;
        }
        const suggestions = await getSuggestions(interaction.guildId);
        if (!suggestions) {
            await interaction.followUp({
                content: 'An error has occurred',
            });
            return;
        }
        await interaction.user.send({
            content: `Here are all the suggestions (${interaction.guildId}): ${codeBlock(
                'yaml',
                suggestions.join('\n')
            )}`,
            flags: [64],
        });
        await interaction.followUp("I've sent you a DM.");
    },
};

export const getSuggestions = async (id: string, full = false) => {
    try {
        const suggestions = await db
            .collection('suggestions')
            .where("guild", "==", `${id}`)
            .where("status", "==", "pending")
            .orderBy('suggestion', 'desc')
            .get();

        const suggestionsArray = suggestions.docs.map(
            (s) => full ? { ...s.data(), id: s.id } : s.data().suggestion
        );

        return suggestionsArray;
    } catch (error) {
        console.log(error);
        return null;
    }
}