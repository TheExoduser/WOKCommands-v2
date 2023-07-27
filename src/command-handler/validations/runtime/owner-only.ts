import Command from "../../Command.js";
import { CommandUsage } from "../../../../typings.js";

export default (command: Command, usage: CommandUsage) => {
  const { instance, commandObject } = command;
  const { botOwners } = instance;
  const { ownerOnly } = commandObject;
  const { user } = usage;

  if (ownerOnly === true && !botOwners.includes(user!.id)) {
    return false;
  }

  return true;
};
