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
    description: 'Lists all suggestions',
    defaultMemberPermissions: [PermissionsBitField.Flags.Administrator],
    run: async (client: Client, interaction: CommandInteraction) => {
        if (!interaction.guildId) {
            await interaction.reply({ content: 'An error has occurred' });
            return;
        }
        const suggestions = await getSuggestions(interaction.guildId, true);
        if (!suggestions) {
            await interaction.reply({
                content: 'An error has occurred',
                ephemeral: true
            });
            return;
        }
        await interaction.user.send({
            content: `Here are all the suggestions (${interaction.guildId}): ${codeBlock(
                'yaml',
                suggestions.map(x => `${x.createdBy.username}#${x.createdBy.discriminator}: ${x.suggestion}`).join('\n')
            )}`,
        });
        await interaction.reply({ content: "I've sent you a DM.", ephemeral: true });
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