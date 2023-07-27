import mong from "mongoose";
const { Schema, model, models } = mong;

const cooldownSchema = new Schema({
  // The key from Cooldowns.getKey()
  _id: {
    type: String,
    required: true,
  },
  expires: {
    type: Date,
    required: true,
  },
});

const name = "cooldowns";
export default models[name] || model(name, cooldownSchema);
