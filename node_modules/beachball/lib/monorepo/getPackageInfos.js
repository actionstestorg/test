"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackageInfos = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const workspace_tools_1 = require("workspace-tools");
const infoFromPackageJson_1 = require("./infoFromPackageJson");
/**
 * Get a mapping from package name to package info for all packages in the workspace
 * (reading from package.json files)
 */
function getPackageInfos(cwd) {
    const projectRoot = (0, workspace_tools_1.findProjectRoot)(cwd);
    const packageRoot = (0, workspace_tools_1.findPackageRoot)(cwd);
    return ((projectRoot && getPackageInfosFromWorkspace(projectRoot)) ||
        (projectRoot && getPackageInfosFromNonWorkspaceMonorepo(projectRoot)) ||
        (packageRoot && getPackageInfosFromSingleRepo(packageRoot)) ||
        {});
}
exports.getPackageInfos = getPackageInfos;
function getPackageInfosFromWorkspace(projectRoot) {
    let workspacePackages;
    try {
        // first try using the workspace provided packages (if available)
        workspacePackages = (0, workspace_tools_1.getWorkspaces)(projectRoot);
    }
    catch (e) {
        // not a recognized workspace from workspace-tools
    }
    if (!workspacePackages?.length) {
        return;
    }
    const packageInfos = {};
    for (const { path: packagePath, packageJson } of workspacePackages) {
        const packageJsonPath = path_1.default.join(packagePath, 'package.json');
        try {
            packageInfos[packageJson.name] = (0, infoFromPackageJson_1.infoFromPackageJson)(packageJson, packageJsonPath);
        }
        catch (e) {
            // Pass, the package.json is invalid
            console.warn(`Problem processing ${packageJsonPath}: ${e}`);
        }
    }
    return packageInfos;
}
function getPackageInfosFromNonWorkspaceMonorepo(projectRoot) {
    const packageJsonFiles = (0, workspace_tools_1.listAllTrackedFiles)(['**/package.json', 'package.json'], projectRoot);
    if (!packageJsonFiles.length) {
        return;
    }
    const packageInfos = {};
    let hasError = false;
    for (const packageJsonPath of packageJsonFiles) {
        try {
            const packageJsonFullPath = path_1.default.join(projectRoot, packageJsonPath);
            const packageJson = fs_extra_1.default.readJSONSync(packageJsonFullPath);
            if (!packageInfos[packageJson.name]) {
                packageInfos[packageJson.name] = (0, infoFromPackageJson_1.infoFromPackageJson)(packageJson, packageJsonFullPath);
            }
            else {
                console.error(`ERROR: Two packages have the same name "${packageJson.name}". Please rename one of these packages:\n` +
                    `- ${path_1.default.relative(projectRoot, packageInfos[packageJson.name].packageJsonPath)}\n` +
                    `- ${packageJsonPath}`);
                // Keep going so we can log all the errors
                hasError = true;
            }
        }
        catch (e) {
            // Pass, the package.json is invalid
            console.warn(`Problem processing ${packageJsonPath}: ${e}`);
        }
    }
    if (hasError) {
        throw new Error('Duplicate package names found (see above for details)');
    }
    return packageInfos;
}
function getPackageInfosFromSingleRepo(packageRoot) {
    const packageInfos = {};
    const packageJsonFullPath = path_1.default.resolve(packageRoot, 'package.json');
    const packageJson = fs_extra_1.default.readJSONSync(packageJsonFullPath);
    packageInfos[packageJson.name] = (0, infoFromPackageJson_1.infoFromPackageJson)(packageJson, packageJsonFullPath);
    return packageInfos;
}
//# sourceMappingURL=getPackageInfos.js.map