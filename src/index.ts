import WOK from "./WOK.js";
import CommandType from "./util/CommandType.js";
import CooldownTypes from "./util/CooldownTypes.js";
import DefaultCommands from "./util/DefaultCommands.js";

module.exports = WOK;
module.exports.CommandType = CommandType;
module.exports.CooldownTypes = CooldownTypes;
module.exports.DefaultCommands = DefaultCommands;

export default WOK;
export { CommandType, CooldownTypes, DefaultCommands };