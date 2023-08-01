import WOK, { CommandObject } from "../../typings.js";

class Command {
  private _instance: WOK;
  private _commandName: string;
  private _commandObject: CommandObject;
  private _filePath: string;

  constructor(
    instance: WOK,
    commandName: string,
    commandObject: CommandObject,
    filePath: string
  ) {
    this._instance = instance;
    this._commandName = commandName.toLowerCase();
    this._commandObject = commandObject;
    this._filePath = filePath;
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

  public get filePath() {
    return this._filePath;
  }
}

export default Command;
