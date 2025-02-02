import mong from "mongoose";
const { Schema, model, models } = mong;

const channelCommandSchema = new Schema({
  // guildId-commandName
  _id: {
    type: String,
    required: true,
  },
  channels: {
    type: [String],
    required: true,
  },
});

const name = "channel-commands";
export default models[name] || model(name, channelCommandSchema);
