export default async (interaction, client, instance) => {
    const { commandHandler } = instance;
    if (!commandHandler) {
        return;
    }
    const { commands } = commandHandler;
    const command = commands.get(interaction.commandName);
    if (!command) {
        return;
    }
    const { autocomplete } = command.commandObject;
    if (!autocomplete) {
        return;
    }
    const focusedOption = interaction.options.getFocused(true);
    const choices = await autocomplete(command, focusedOption.name, interaction, client, instance);
    const filtered = choices
        .filter((choice) => {
        const choiceName = choice.name || choice;
        return choiceName.toLowerCase().includes(focusedOption.value.toLowerCase());
    })
        .slice(0, 25);
    await interaction.respond(filtered.map((choice) => ({
        name: choice.name || choice,
        value: choice.value || choice,
    })));
};
