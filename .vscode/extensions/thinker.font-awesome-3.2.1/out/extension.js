"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const enum_constants_modal_1 = require("./enum.constants.modal");
const IconsView_1 = require("./IconsView");
const LocalStorageService_1 = require("./LocalStorageService");
function activate(context) {
    const storage = new LocalStorageService_1.default(context.workspaceState);
    const iconsView = new IconsView_1.IconsView(context.extensionUri, storage);
    const setContext = (key, value) => {
        storage.setValue(key, value);
        vscode.commands.executeCommand('setContext', key, value);
    };
    setContext('showIconName', true); // Show Icon name by default
    setContext('showIconInfo', true); // Show Icon Snippet by default
    setContext('showCategoryBadge', true); // Show Category badges by default
    setContext('sortByFeature', true); // Sort by Features by default
    context.subscriptions.push(vscode.commands.registerCommand(enum_constants_modal_1.Commands.COPY_ICON_AS, async () => {
        const copyType = await vscode.window.showQuickPick(["name", "class", "html", "react", "vue", "svg", "base64", "unicode"]);
        if (!copyType)
            return;
        iconsView.menuAction("setCopyType", copyType);
    }));
    context.subscriptions.push(vscode.commands.registerCommand(enum_constants_modal_1.Commands.SHOW_ICON_NAME, () => {
        setContext('showIconName', true);
        iconsView.menuAction("ToggleIconName", true);
    }));
    context.subscriptions.push(vscode.commands.registerCommand(enum_constants_modal_1.Commands.HIDE_ICON_NAME, () => {
        setContext('showIconName', false);
        iconsView.menuAction("ToggleIconName", false);
    }));
    context.subscriptions.push(vscode.commands.registerCommand(enum_constants_modal_1.Commands.SHOW_ICON_INFO, () => {
        setContext('showIconInfo', true);
        iconsView.menuAction("ToggleIconInfo", true);
    }));
    context.subscriptions.push(vscode.commands.registerCommand(enum_constants_modal_1.Commands.HIDE_ICON_INFO, () => {
        setContext('showIconInfo', false);
        iconsView.menuAction("ToggleIconInfo", false);
    }));
    context.subscriptions.push(vscode.commands.registerCommand(enum_constants_modal_1.Commands.SHOW_CATEGORY_BADGE, () => {
        setContext('showCategoryBadge', true);
        iconsView.menuAction("ToggleCategoryBadge", true);
    }));
    context.subscriptions.push(vscode.commands.registerCommand(enum_constants_modal_1.Commands.HIDE_CATEGORY_BADGE, () => {
        setContext('showCategoryBadge', false);
        iconsView.menuAction("ToggleCategoryBadge", false);
    }));
    const sortByFeature = () => {
        setContext('sortByFeature', true);
        storage.setValue("sortType", "feature");
        iconsView.menuAction("ToggleSortByFeature", true);
    };
    const sortByAlphabet = () => {
        setContext('sortByFeature', false);
        storage.setValue("sortType", "alphabet");
        iconsView.menuAction("ToggleSortByFeature", false);
    };
    context.subscriptions.push(vscode.commands.registerCommand(enum_constants_modal_1.Commands.SHOW_SORT_BY_FEATURE, sortByFeature));
    context.subscriptions.push(vscode.commands.registerCommand(enum_constants_modal_1.Commands.HIDE_SORT_BY_ALPHABETICAL, sortByFeature));
    context.subscriptions.push(vscode.commands.registerCommand(enum_constants_modal_1.Commands.HIDE_SORT_BY_FEATURE, sortByAlphabet));
    context.subscriptions.push(vscode.commands.registerCommand(enum_constants_modal_1.Commands.SHOW_SORT_BY_ALPHABETICAL, sortByAlphabet));
    context.subscriptions.push(vscode.commands.registerCommand(enum_constants_modal_1.Commands.SAVE_ICON, () => iconsView.saveIcon()));
    context.subscriptions.push(vscode.commands.registerCommand(enum_constants_modal_1.Commands.REFRESH_VIEW, () => iconsView.refreshView()));
    context.subscriptions.push(vscode.commands.registerCommand(enum_constants_modal_1.Commands.DOWNLOAD_ARCHIVE, () => iconsView.downloadIconArchive()));
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(IconsView_1.IconsView.viewType, iconsView));
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map