"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackageGroups = void 0;
const path_1 = __importDefault(require("path"));
const isPathIncluded_1 = require("./isPathIncluded");
function getPackageGroups(packageInfos, root, groups) {
    var _a;
    if (!groups?.length) {
        return {};
    }
    const packageGroups = {};
    const packageNameToGroup = {};
    const errorPackages = {};
    // Check every package to see which group it belongs to
    for (const [pkgName, info] of Object.entries(packageInfos)) {
        const packagePath = path_1.default.dirname(info.packageJsonPath);
        const relativePath = path_1.default.relative(root, packagePath);
        const groupsForPkg = groups.filter(group => (0, isPathIncluded_1.isPathIncluded)(relativePath, group.include, group.exclude));
        if (groupsForPkg.length > 1) {
            // Keep going after this error to ensure we report all errors
            errorPackages[pkgName] = groupsForPkg;
        }
        else if (groupsForPkg.length === 1) {
            const group = groupsForPkg[0];
            packageNameToGroup[pkgName] = group.name;
            packageGroups[_a = group.name] ?? (packageGroups[_a] = {
                packageNames: [],
                disallowedChangeTypes: group.disallowedChangeTypes,
            });
            packageGroups[group.name].packageNames.push(pkgName);
        }
    }
    if (errorPackages.length) {
        console.error(`ERROR: Found package(s) belonging to multiple groups:\n` +
            Object.entries(errorPackages)
                .map(([pkgName, groups]) => `- ${pkgName}: [${groups.map(g => g.name).join(', ')}]`)
                .sort()
                .join('\n'));
        // TODO: probably more appropriate to throw here and let the caller handle it?
        process.exit(1);
    }
    return packageGroups;
}
exports.getPackageGroups = getPackageGroups;
//# sourceMappingURL=getPackageGroups.js.map