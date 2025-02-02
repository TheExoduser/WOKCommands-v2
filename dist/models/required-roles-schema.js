import mong from "mongoose";
const { Schema, model, models } = mong;
const requiredRolesSchema = new Schema({
    // guildId-commandName
    _id: {
        type: String,
        required: true,
    },
    roles: {
        type: [String],
        required: true,
    },
});
const name = "required-roles";
export default models[name] || model(name, requiredRolesSchema);
