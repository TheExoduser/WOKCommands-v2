import mong from "mongoose";
const { Schema, model, models } = mong;
const disabledCommandSchema = new Schema({
    // guildId-commandName
    _id: {
        type: String,
        required: true,
    },
});
const name = "disabled-commands";
export default models[name] || model(name, disabledCommandSchema);
