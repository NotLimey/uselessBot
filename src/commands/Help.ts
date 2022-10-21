import { codeBlock } from "discord.js";
import { Command } from "src/Command";
import { Commands } from "../Commands";

export const Help: Command = {
    name: "help",
    description: "Lists all commands",
    run: async (client, interaction) => {
        const cs = Commands.filter((c) => {
            if (c.name === "help") return false;
            // has permissions
            if (c.defaultMemberPermissions) {
                if (!interaction.memberPermissions?.has(c.defaultMemberPermissions)) return false;
            }

            return true;
        });
        const commands = cs.map((c) => ({
            name: c.name,
            description: c.description,
        }));
        console.log(commands)
        await interaction.reply({
            content: `Here are all the commands: ${codeBlock("yaml", commands.map(x => `${x.name}: ${x.description}`).join("\n"))}`,
            ephemeral: true,
        })
    }
}