import Command from "../../Command.js";
import { CommandUsage } from "../../../../typings.js";

export default (command: Command, usage: CommandUsage) => {
  const { instance, commandObject } = command;
  const { guild } = usage;

  if (commandObject.testOnly !== true) {
    return true;
  }

  return instance.testServers.includes(guild?.id || "");
};
