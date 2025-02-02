import getAllFiles from './get-all-files.js';
class FeaturesHandler {
    constructor(instance, featuresDir, client) {
        this.readFiles(instance, featuresDir, client);
    }
    async readFiles(instance, featuresDir, client) {
        const files = await getAllFiles(featuresDir);
        for (const file of files) {
            let func = require(file.filePath);
            func = func.default || func;
            if (func instanceof Function) {
                await func(instance, client);
            }
        }
    }
}
export default FeaturesHandler;
