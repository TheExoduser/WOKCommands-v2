import WOK, { CommandObject } from "../../typings";

class Command {
  private _instance: WOK;
  private _commandName: string;
  private _commandObject: CommandObject;

  constructor(
    instance: WOK,
    commandObject: CommandObject
  ) {
    this._instance = instance;
    this._commandObject = commandObject;

    if (!this._commandObject.name) throw new Error("Command is missing a name!");

    this._commandName = this._commandObject.name.toLowerCase();
  }

  public get instance() {
    return this._instance;
  }

  public get commandName() {
    return this._commandName;
  }

  public get commandObject() {
    return this._commandObject;
  }
}

export default Command;
