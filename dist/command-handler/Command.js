class Command {
    _instance;
    _commandName;
    _commandObject;
    _filePath;
    constructor(instance, commandName, commandObject, filePath) {
        this._instance = instance;
        this._commandName = commandName.toLowerCase();
        this._commandObject = commandObject;
        this._filePath = filePath;
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
    get filePath() {
        return this._filePath;
    }
}
export default Command;
