"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDisallowedChangeTypes = void 0;
function getDisallowedChangeTypes(packageName, packageInfos, packageGroups) {
    for (const group of Object.values(packageGroups)) {
        if (group.packageNames.includes(packageName)) {
            return group.disallowedChangeTypes || null;
        }
    }
    return packageInfos[packageName]?.combinedOptions.disallowedChangeTypes || null;
}
exports.getDisallowedChangeTypes = getDisallowedChangeTypes;
//# sourceMappingURL=getDisallowedChangeTypes.js.map