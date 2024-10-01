"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isChangeFileNeeded = void 0;
const getChangedPackages_1 = require("../changefile/getChangedPackages");
function isChangeFileNeeded(options, packageInfos) {
    const { branch } = options;
    console.log(`Checking for changes against "${branch}"`);
    const changedPackages = (0, getChangedPackages_1.getChangedPackages)(options, packageInfos);
    if (changedPackages.length > 0) {
        console.log(`Found changes in the following packages: ${[...changedPackages]
            .sort()
            .map(pkg => `\n  ${pkg}`)
            .join('')}`);
        return true;
    }
    return false;
}
exports.isChangeFileNeeded = isChangeFileNeeded;
//# sourceMappingURL=isChangeFileNeeded.js.map