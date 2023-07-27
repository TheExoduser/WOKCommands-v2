import mongoose from 'mongoose';
import { EventEmitter } from 'events';
import CommandHandler from './command-handler/CommandHandler.js';
import EventHandler from './event-handler/EventHandler.js';
import Cooldowns from './util/Cooldowns.js';
import FeaturesHandler from './util/FeaturesHandler.js';
class WOKCommands extends EventEmitter {
    _client;
    _testServers;
    _botOwners;
    _cooldowns;
    _disabledDefaultCommands;
    _validations;
    _commandHandler;
    _eventHandler;
    _isConnectedToDB = false;
    _defaultPrefix = '!';
    constructor(options) {
        super();
        this.init(options);
    }
    async init(options) {
        let { client, mongoUri, commandsDir, featuresDir, testServers = [], botOwners = [], cooldownConfig, disabledDefaultCommands = [], events = {}, validations = {}, defaultPrefix, } = options;
        if (!client) {
            throw new Error('A client is required.');
        }
        if (mongoUri) {
            await this.connectToMongo(mongoUri);
        }
        // Add the bot owner's ID
        if (botOwners.length === 0) {
            await client.application?.fetch();
            const ownerId = client.application?.owner?.id;
            if (ownerId && botOwners.indexOf(ownerId) === -1) {
                botOwners.push(ownerId);
            }
        }
        this._client = client;
        this._testServers = testServers;
        this._botOwners = botOwners;
        this._disabledDefaultCommands = disabledDefaultCommands;
        this._validations = validations;
        this._cooldowns = new Cooldowns(this, {
            errorMessage: 'Please wait {TIME} before doing that again.',
            botOwnersBypass: false,
            dbRequired: 300,
            ...cooldownConfig,
        });
        if (defaultPrefix) {
            this._defaultPrefix = defaultPrefix;
        }
        if (commandsDir) {
            this._commandHandler = new CommandHandler(this, commandsDir, client);
        }
        if (featuresDir) {
            new FeaturesHandler(this, featuresDir, client);
        }
        this._eventHandler = new EventHandler(this, events, client);
    }
    get client() {
        return this._client;
    }
    get testServers() {
        return this._testServers;
    }
    get botOwners() {
        return this._botOwners;
    }
    get cooldowns() {
        return this._cooldowns;
    }
    get disabledDefaultCommands() {
        return this._disabledDefaultCommands;
    }
    get commandHandler() {
        return this._commandHandler;
    }
    get eventHandler() {
        return this._eventHandler;
    }
    get validations() {
        return this._validations;
    }
    get isConnectedToDB() {
        return this._isConnectedToDB;
    }
    get defaultPrefix() {
        return this._defaultPrefix;
    }
    async connectToMongo(mongoUri) {
        await mongoose.connect(mongoUri, {
            keepAlive: true,
        });
        this._isConnectedToDB = true;
    }
}
export default WOKCommands;
