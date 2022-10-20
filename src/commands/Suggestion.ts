import { CommandInteraction, Client } from "discord.js";
import { Command } from "../Command";

export const Suggestion: Command = {
    name: "suggestion",
    description: "Returns a greeting",
    run: async (client: Client, interaction: CommandInteraction) => {
        const content = "Hello there!";

        await interaction.followUp({
            ephemeral: true,
            content
        });
    }
}; 