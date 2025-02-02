import customCommandSchema from '../models/custom-command-schema.js';
class CustomCommands {
    // guildId-commandName: response
    _customCommands = new Map();
    _commandHandler;
    _instance;
    constructor(instance, commandHandler) {
        this._instance = instance;
        this._commandHandler = commandHandler;
        this.loadCommands();
    }
    async loadCommands() {
        if (!this._instance.isConnectedToDB) {
            return;
        }
        const results = await customCommandSchema.find({});
        for (const result of results) {
            const { _id, response } = result;
            this._customCommands.set(_id, response);
        }
    }
    getCommands(guildId) {
        const commands = [];
        for (const [key] of this._customCommands) {
            const [id, commandName] = key.split('-');
            if (id === guildId) {
                commands.push(commandName);
            }
        }
        return commands;
    }
    async create(guildId, commandName, description, response) {
        if (!this._instance.isConnectedToDB) {
            return;
        }
        const _id = `${guildId}-${commandName}`;
        this._customCommands.set(_id, response);
        this._commandHandler.slashCommands.create(commandName, description, [], guildId);
        await customCommandSchema.findOneAndUpdate({
            _id,
        }, {
            _id,
            response,
        }, {
            upsert: true,
        });
    }
    async delete(guildId, commandName) {
        if (!this._instance.isConnectedToDB) {
            return;
        }
        const _id = `${guildId}-${commandName}`;
        this._customCommands.delete(_id);
        this._commandHandler.slashCommands.delete(commandName, guildId);
        await customCommandSchema.deleteOne({ _id });
    }
    async run(commandName, message, interaction) {
        if (!message && !interaction) {
            return;
        }
        const guild = message ? message.guild : interaction.guild;
        if (!guild) {
            return;
        }
        const _id = `${guild.id}-${commandName}`;
        const response = this._customCommands.get(_id);
        if (!response) {
            return;
        }
        if (message) {
            message.channel.send(response).catch(() => { });
        }
        else if (interaction) {
            interaction.reply(response).catch(() => { });
        }
    }
}
export default CustomCommands;
