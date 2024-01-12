"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIcons = exports.getAllSVGIcons = exports.getStats = void 0;
const fs = require("fs");
const path = require("path");
const Settings_1 = require("./Settings");
const vscode = require("vscode");
// This may throw an error in mac.
let potrace;
try {
    potrace = require("potrace");
}
catch (err) {
    console.error(err);
}
const brands = require("../icons/brands.json");
const regular = require("../icons/regular.json");
const solid = require("../icons/solid.json");
const getTitleCaseName = (name) => {
    const nameChunk = name.replace(/(_|-)suite/gi, " ").replace(/(_|-)/gi, " ").split(/(_|-|\s)/g);
    const titleCaseName = nameChunk
        .map(n => n.charAt(0).toUpperCase() + n.substring(1).toLowerCase()).join(' ');
    return titleCaseName.replace(/\s{2,}/g, " ");
};
const getStats = (directoryPath) => {
    if (fs.existsSync(directoryPath)) {
        const stats = fs.statSync(directoryPath);
        const extension = path.extname(directoryPath);
        const fileName = path.basename(directoryPath, extension);
        const isFile = stats.isFile();
        if (isFile) {
            const dirBaseName = path.basename(path.dirname(directoryPath));
            const customIconsBaseName = path.basename(Settings_1.Settings.customIconsFolderPath);
            const familyName = path.relative(Settings_1.Settings.customIconsFolderPath, path.dirname(directoryPath)).split(path.sep).shift();
            const family = familyName !== ".." ? familyName : "";
            const category = [dirBaseName, customIconsBaseName].includes(family) || customIconsBaseName === dirBaseName ? "" : dirBaseName;
            const iconName = fileName;
            return {
                category: getTitleCaseName(category),
                family: getTitleCaseName(family),
                iconName: getTitleCaseName(iconName),
                extension,
                filePath: directoryPath,
                isFile: stats.isFile(),
            };
        }
        return {
            filePath: directoryPath,
            isFile: stats.isFile(),
        };
    }
    return;
};
exports.getStats = getStats;
const getAllSVGIcons = (directoryPath) => {
    const stats = (0, exports.getStats)(directoryPath);
    if (!stats) {
        return [];
    }
    else if (stats.isFile) {
        return [".svg", ".png", ".jpg"].includes(stats.extension) ? [stats] : [];
    }
    else {
        const files = fs.readdirSync(directoryPath);
        const filesList = files.reduce((res, file) => {
            return res.concat((0, exports.getAllSVGIcons)(`${directoryPath}/${file}`));
        }, []);
        return filesList;
    }
};
exports.getAllSVGIcons = getAllSVGIcons;
const getSVGTextFromSVGFile = (filePath) => {
    const oldFileName = filePath;
    const newFileName = filePath.replace(".svg", ".txt");
    fs.renameSync(oldFileName, newFileName);
    const svgText = fs.readFileSync(newFileName, 'utf8');
    fs.renameSync(newFileName, oldFileName);
    return svgText;
};
const getSVGTextFromImageFile = async (filePath) => {
    return new Promise(resolve => {
        potrace?.trace(filePath, { color: Settings_1.Settings.fillColor }, (_err, svg) => resolve(svg || ""));
    });
};
const getCustomIconSetsFromFolder = async (customIconsFolderPath = '') => {
    try {
        if (!customIconsFolderPath) {
            return [];
        }
        ;
        const customIcons = [];
        const svgIconPaths = (0, exports.getAllSVGIcons)(customIconsFolderPath);
        for (const svgPathDetails of svgIconPaths) {
            const { family, category, iconName, filePath, extension, } = svgPathDetails;
            const svg = extension !== ".svg" && potrace ? await getSVGTextFromImageFile(filePath) : getSVGTextFromSVGFile(filePath);
            const base64 = svg ? 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64') : "";
            customIcons.push({
                name: iconName.replace(/\s/g, "-").toLowerCase(),
                label: iconName,
                svg,
                base64,
                family: family,
                keywords: [iconName, family, category].filter(Boolean).map(kw => kw?.replace(/\s/g, "-").toLowerCase()),
                categories: [category].filter(Boolean).map(kw => kw?.replace(/\s/g, "-").toLowerCase())
            });
        }
        return customIcons.filter(icon => icon.categories?.length && icon.family);
    }
    catch (err) {
        console.log(err);
        return [];
    }
};
const getIcons = async () => {
    try {
        const customIcons = Settings_1.Settings.customIcons;
        const customIconsFromFolder = await getCustomIconSetsFromFolder(Settings_1.Settings.customIconsFolderPath);
        const customIconsArchive = Settings_1.Settings.customIconsArchivePath ? await JSON.parse(fs.readFileSync(Settings_1.Settings.customIconsArchivePath, 'utf-8')) : [];
        const icons = [
            ...regular,
            ...solid,
            ...brands,
            ...customIcons,
            ...customIconsFromFolder,
            ...customIconsArchive
        ];
        const uniqueIcons = [...new Map(icons.map(icon => [`${icon.name}-${icon.family}`, icon])).values()];
        return uniqueIcons;
    }
    catch (err) {
        vscode.window.showErrorMessage(err.message);
        return [
            ...regular,
            ...solid,
            ...brands,
        ];
    }
};
exports.getIcons = getIcons;
//# sourceMappingURL=utilities.js.map