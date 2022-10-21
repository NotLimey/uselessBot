import { CommandInteraction, Client, Interaction } from "discord.js";
import { Commands } from "./Commands";
import { handleRemoveSuggestion } from "./commands/RemoveSuggestion";

export default (client: Client): void => {
    client.on("interactionCreate", async (interaction: Interaction) => {
        if (interaction.isCommand() || interaction.isContextMenuCommand()) {
            await handleSlashCommand(client, interaction);
        }
        if (interaction.isSelectMenu() && interaction.customId === "remove-suggestion") {
            try {
                console.log("Removing suggestion", interaction.values[0]);
                interaction.values.forEach(async (value) => {
                    await handleRemoveSuggestion(value);
                });
                interaction.update({
                    content: "Removed suggestion",
                    components: [],
                })
            } catch (e) {
                console.error("2. Error removing suggestion", e);
            }
        }
    });
};

const handleSlashCommand = async (client: Client, interaction: CommandInteraction): Promise<void> => {
    const slashCommand = Commands.find(c => c.name === interaction.commandName);
    if (!slashCommand) {
        interaction.reply({ content: "An error has occurred", ephemeral: true });
        return;
    }

    try {
        slashCommand.run(client, interaction);
    } catch (e) {
        console.log(e);
        interaction.reply({ content: "An error has occurred", ephemeral: true });
    }
}; 