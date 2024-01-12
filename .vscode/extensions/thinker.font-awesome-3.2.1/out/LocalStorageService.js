'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
class LocalStorageService {
    constructor(storage) {
        this.storage = storage;
    }
    getValue(key, defaultValue) {
        return this.storage.get(key, defaultValue);
    }
    setValue(key, value) {
        this.storage.update(key, value);
    }
}
exports.default = LocalStorageService;
//# sourceMappingURL=LocalStorageService.js.map