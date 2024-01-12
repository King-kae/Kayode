"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Settings = void 0;
const vscode = require("vscode");
class Settings {
    static get iconsConfiguration() {
        return vscode.workspace.getConfiguration('font-awesome.settings');
    }
    static getSettings(key) {
        return Settings.iconsConfiguration.get(key);
    }
    static setSettings(key, val, isUser = true) {
        return Settings.iconsConfiguration.update(key, val, isUser);
    }
    static get pngDimensions() {
        return Settings.getSettings('pngDimensions');
    }
    static get fillColor() {
        return Settings.getSettings('fillColor');
    }
    static get pngIconColor() {
        return Settings.getSettings('pngIconColor');
    }
    static get customIconsArchivePath() {
        return Settings.getSettings('customIconsArchivePath');
    }
    static get customIconsFolderPath() {
        return Settings.getSettings('customIconsFolderPath');
    }
    static get customIcons() {
        return Settings.getSettings('customIcons');
    }
}
exports.Settings = Settings;
//# sourceMappingURL=Settings.js.map