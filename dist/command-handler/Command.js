"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Command {
    _instance;
    _commandName;
    _commandObject;
    constructor(instance, commandObject) {
        this._instance = instance;
        this._commandObject = commandObject;
        if (!this._commandObject.name)
            throw new Error("Command is missing a name!");
        this._commandName = this._commandObject.name.toLowerCase();
    }
    get instance() {
        return this._instance;
    }
    get commandName() {
        return this._commandName;
    }
    get commandObject() {
        return this._commandObject;
    }
}
exports.default = Command;
