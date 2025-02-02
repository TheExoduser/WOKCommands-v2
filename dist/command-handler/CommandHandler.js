import path from "path";
import getAllFiles from "../util/get-all-files.js";
import Command from "./Command.js";
import SlashCommands from "./SlashCommands.js";
import ChannelCommands from "./ChannelCommands.js";
import CustomCommands from "./CustomCommands.js";
import DisabledCommands from "./DisabledCommands.js";
import PrefixHandler from "./PrefixHandler.js";
import CommandType from "../util/CommandType.js";
import DefaultCommands from "../util/DefaultCommands.js";
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
class CommandHandler {
    // <commandName, instance of the Command class>
    _commands = new Map();
    _validations;
    _instance;
    _client;
    _commandsDir;
    _slashCommands;
    _channelCommands;
    _customCommands;
    _disabledCommands;
    _prefixes;
    constructor(instance, commandsDir, client) {
        this._instance = instance;
        this._commandsDir = commandsDir;
        this._slashCommands = new SlashCommands(client);
        this._client = client;
        this._channelCommands = new ChannelCommands(instance);
        this._customCommands = new CustomCommands(instance, this);
        this._disabledCommands = new DisabledCommands(instance);
        this._prefixes = new PrefixHandler(instance);
        this.loadValidations(instance).then(() => this.readFiles());
    }
    get commands() {
        return this._commands;
    }
    get channelCommands() {
        return this._channelCommands;
    }
    get slashCommands() {
        return this._slashCommands;
    }
    get customCommands() {
        return this._customCommands;
    }
    get disabledCommands() {
        return this._disabledCommands;
    }
    get prefixHandler() {
        return this._prefixes;
    }
    async loadValidations(instance) {
        this._validations = await this.getValidations(path.join(__dirname, "validations", "runtime"));
        this._validations = [
            ...this._validations,
            ...(await this.getValidations(instance.validations?.runtime)),
        ];
    }
    async readFiles() {
        const defaultCommands = await getAllFiles(path.join(__dirname, "./commands"));
        const files = await getAllFiles(this._commandsDir);
        const validations = [
            ...(await this.getValidations(path.join(__dirname, "validations", "syntax"))),
            ...(await this.getValidations(this._instance.validations?.syntax)),
        ];
        for (let fileData of [...defaultCommands, ...files]) {
            const { filePath } = fileData;
            // Skip if not js file
            if (!filePath.endsWith(".js"))
                continue;
            let commandObject = fileData.fileContents;
            const split = filePath.split(/[\/\\]/);
            let commandName = split.pop();
            commandName = commandName.split(".")[0];
            const command = new Command(this._instance, commandName, commandObject, filePath);
            let { description, type, testOnly, delete: del, aliases = [], name, } = commandObject;
            let defaultCommandValue;
            for (const [key, value] of Object.entries(DefaultCommands)) {
                if (value === name.toLowerCase()) {
                    defaultCommandValue =
                        DefaultCommands[key];
                    break;
                }
            }
            if (del ||
                (defaultCommandValue &&
                    this._instance.disabledDefaultCommands.includes(defaultCommandValue))) {
                if (type === "SLASH" || type === "BOTH") {
                    if (testOnly) {
                        for (const guildId of this._instance.testServers) {
                            this._slashCommands.delete(name, guildId);
                        }
                    }
                    else {
                        this._slashCommands.delete(name);
                    }
                }
                continue;
            }
            for (const validation of validations) {
                validation(command);
            }
            if ("init" in commandObject) {
                const res = await commandObject.init(this._client, this._instance);
                if (res) {
                    commandObject = res;
                    description = res.description;
                    type = res.type;
                    testOnly = res.testOnly;
                    del = res.del;
                    aliases = res.aliases;
                    name = res.name;
                }
            }
            const names = [name, ...aliases];
            for (const n of names) {
                this._commands.set(n, command);
            }
            if (type === "SLASH" || type === "BOTH") {
                const options = commandObject.options ||
                    this._slashCommands.createOptions(commandObject);
                if (testOnly) {
                    for (const guildId of this._instance.testServers) {
                        this._slashCommands.create(name, description, options, guildId);
                    }
                }
                else {
                    this._slashCommands.create(name, description, options);
                }
            }
        }
    }
    async runCommand(command, args, message, interaction, fullCommand) {
        const { callback, type, cooldowns } = command.commandObject;
        if (message && type === CommandType.SLASH) {
            return;
        }
        const guild = message ? message.guild : interaction?.guild;
        const member = (message ? message.member : interaction?.member);
        const user = message ? message.author : interaction?.user;
        const channel = (message ? message.channel : interaction?.channel);
        const usage = {
            client: command.instance.client,
            instance: command.instance,
            message,
            interaction,
            args,
            text: args.join(" "),
            guild,
            member,
            user: user,
            channel,
        };
        for (const validation of this._validations) {
            if (!(await validation(command, usage, this._prefixes.get(guild?.id)))) {
                return;
            }
        }
        if (cooldowns) {
            const cooldownUsage = {
                cooldownType: cooldowns.type,
                userId: user.id,
                actionId: `command_${command.commandName}`,
                guildId: guild?.id,
                duration: cooldowns.duration,
                errorMessage: cooldowns.errorMessage,
            };
            const result = this._instance.cooldowns?.canRunAction(cooldownUsage);
            if (typeof result === "string") {
                return result;
            }
            await this._instance.cooldowns?.start(cooldownUsage);
            usage.cancelCooldown = () => {
                this._instance.cooldowns?.cancelCooldown(cooldownUsage);
            };
            usage.updateCooldown = (expires) => {
                this._instance.cooldowns?.updateCooldown(cooldownUsage, expires);
            };
        }
        const callResult = await callback(usage);
        this._client.emit("commandExecuted", {
            command,
            fullCommand: fullCommand,
            member: member,
            guild: guild,
            channel: channel,
            message,
            args: args,
            text: args.join(" "),
            client: this._client,
            instance: this._instance,
            interaction,
        });
        return callResult;
    }
    async getValidations(folder) {
        if (!folder) {
            return [];
        }
        return (await getAllFiles(folder)).map((fileData) => fileData.fileContents);
    }
}
export default CommandHandler;
