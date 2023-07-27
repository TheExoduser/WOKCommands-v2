import guildPrefixSchema from "../models/guild-prefix-schema.js";
class PrefixHandler {
    // <guildId: prefix>
    _prefixes = new Map();
    _instance;
    constructor(instance) {
        this._instance = instance;
        // Skip prefix loading, handled by custom bot
        // this.loadPrefixes();
    }
    async loadPrefixes() {
        if (!this._instance.isConnectedToDB) {
            return;
        }
        const results = await guildPrefixSchema.find({});
        for (const result of results) {
            this._prefixes.set(result._id, result.prefix);
        }
    }
    get defaultPrefix() {
        return this._instance.defaultPrefix;
    }
    get(guildId) {
        if (!guildId) {
            return this.defaultPrefix;
        }
        return this._prefixes.get(guildId) || this.defaultPrefix;
    }
    async set(guildId, prefix) {
        /*
        if (!this._instance.isConnectedToDB) {
          return;
        }
        */
        this._prefixes.set(guildId, prefix);
        /*
        await guildPrefixSchema.findOneAndUpdate(
          {
            _id: guildId,
          },
          {
            _id: guildId,
            prefix,
          },
          {
            upsert: true,
          }
        );
         */
    }
}
export default PrefixHandler;
