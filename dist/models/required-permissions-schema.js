import mong from "mongoose";
const { Schema, model, models } = mong;
const requiredPermissionsSchema = new Schema({
    // guildId-commandName
    _id: {
        type: String,
        required: true,
    },
    permissions: {
        type: [String],
        required: true,
    },
});
const name = "required-permissions";
export default models[name] || model(name, requiredPermissionsSchema);
