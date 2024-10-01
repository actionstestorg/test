"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidGroupedPackageOptions = exports.isValidGroupOptions = void 0;
const format_1 = require("../logging/format");
function isValidGroupOptions(groups) {
    // Values that violate types could happen in a user-provided object
    if (!Array.isArray(groups)) {
        console.error('ERROR: Expected "groups" configuration setting to be an array. Received:\n' + JSON.stringify(groups));
        return false;
    }
    const badGroups = groups.filter(group => !group.include || !group.name);
    if (badGroups.length) {
        console.error('ERROR: "groups" configuration entries must define "include" and "name". Found invalid groups:\n' +
            badGroups.map(group => '  ' + (0, format_1.singleLineStringify)(group)).join('\n'));
        return false;
    }
    return true;
}
exports.isValidGroupOptions = isValidGroupOptions;
/** Validate per-package beachball options are valid for packages in groups */
function isValidGroupedPackageOptions(packageInfos, packageGroups) {
    const errorPackages = [];
    // make sure no disallowed change type options exist inside an individual package
    for (const [groupName, { packageNames }] of Object.entries(packageGroups)) {
        for (const pkgName of packageNames) {
            if (packageInfos[pkgName].packageOptions.disallowedChangeTypes) {
                errorPackages.push(`${pkgName} in group "${groupName}"`);
            }
        }
    }
    if (errorPackages.length) {
        console.error('ERROR: Found package configs that define disallowedChangeTypes and are also part of a group. ' +
            'Define disallowedChangeTypes in the group instead.\n' +
            (0, format_1.formatList)(errorPackages.sort()));
        return false;
    }
    return true;
}
exports.isValidGroupedPackageOptions = isValidGroupedPackageOptions;
//# sourceMappingURL=isValidGroupOptions.js.map