"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePackageVersions = void 0;
const listPackageVersions_1 = require("../packageManager/listPackageVersions");
const format_1 = require("../logging/format");
/**
 * Validate each package version being published doesn't already exist in the registry.
 */
async function validatePackageVersions(packagesToValidate, packageInfos, options) {
    console.log('\nValidating new package versions...');
    const publishedVersions = await (0, listPackageVersions_1.listPackageVersions)(packagesToValidate, options);
    const okVersions = [];
    const errorVersions = [];
    for (const pkg of packagesToValidate) {
        const packageInfo = packageInfos[pkg];
        const versionSpec = `${packageInfo.name}@${packageInfo.version}`;
        if (publishedVersions[pkg].includes(packageInfo.version)) {
            errorVersions.push(versionSpec);
        }
        else {
            okVersions.push(versionSpec);
        }
    }
    if (okVersions.length) {
        // keep the original order here to show what order they'll be published in
        console.log(`\nPackage versions are OK to publish:\n${(0, format_1.formatList)(okVersions)}`);
    }
    if (errorVersions.length) {
        console.error(`\nERROR: Attempting to publish package versions that already exist in the registry:\n` +
            (0, format_1.formatList)(errorVersions.sort()));
        return false;
    }
    return true;
}
exports.validatePackageVersions = validatePackageVersions;
//# sourceMappingURL=validatePackageVersions.js.map