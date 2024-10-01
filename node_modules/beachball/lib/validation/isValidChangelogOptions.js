"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidChangelogOptions = void 0;
const format_1 = require("../logging/format");
function isValidChangelogOptions(options) {
    if (!options.groups) {
        return true;
    }
    const badGroups = options.groups.filter(group => !group.changelogPath || !group.masterPackageName || !group.include);
    if (badGroups.length) {
        console.error('ERROR: "changelog.groups" entries must define "changelogPath", "masterPackageName", and "include". ' +
            'Found invalid groups:\n' +
            badGroups.map(group => '  ' + (0, format_1.singleLineStringify)(group)).join('\n'));
        return false;
    }
    return true;
}
exports.isValidChangelogOptions = isValidChangelogOptions;
//# sourceMappingURL=isValidChangelogOptions.js.map