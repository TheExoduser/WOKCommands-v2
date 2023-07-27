import { CommandInteraction, Client, EmbedBuilder } from "discord.js";

import WOK from "../../../../../typings.js";

export default async (interaction: CommandInteraction, client: Client, instance: WOK) => {
    const { commandHandler } = instance;
    if (!commandHandler) {
        return;
    }

    const { commands, customCommands } = commandHandler;

    let args: string[] = [], subCommand, fullCommand = null;

    // @ts-ignore
    if (!interaction.options.getSubcommand(false)) {
        args = interaction.options.data.map(({ value }) => {
            return String(value);
        });
    } else if (interaction.options.data.length > 0) {
        // @ts-ignore
        subCommand = interaction.options.getSubcommand(false);
        args = interaction.options.data[0].options?.map(({ value }) => {
            return String(value);
        }) || [];
    }

    const command = commands.get(interaction.commandName);
    if (!command) {
        customCommands.run(interaction.commandName, null, interaction);
        return;
    }

    const { deferReply } = command.commandObject;

    if (deferReply) {
        await interaction.deferReply({
            ephemeral: deferReply === "ephemeral",
        });
    }

    const response = await commandHandler.runCommand(
        command,
        args,
        null,
        interaction,
        fullCommand = `${command.commandObject.name}${subCommand ? (" " + subCommand) : ""}`
    );
    if (!response) {
        return;
    }

    if (deferReply) {
        interaction.editReply(response).catch(() => {
        });
    } else {
        interaction.reply(response).catch(() => {
        });
    }
};
