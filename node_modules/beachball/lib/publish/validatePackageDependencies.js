"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePackageDependencies = void 0;
/**
 * Validate no private package is listed as package dependency for packages which will be published.
 */
function validatePackageDependencies(packagesToValidate, packageInfos) {
    /** Mapping from dep to all validated packages that depend on it */
    const allDeps = {};
    for (const pkg of packagesToValidate) {
        for (const dep of Object.keys(packageInfos[pkg].dependencies || {})) {
            allDeps[dep] ?? (allDeps[dep] = []);
            allDeps[dep].push(pkg);
        }
    }
    console.log(`Validating no private package among package dependencies`);
    const errorDeps = Object.keys(allDeps).filter(dep => packageInfos[dep]?.private);
    if (errorDeps.length) {
        console.error(`ERROR: Found private packages among published package dependencies:\n` +
            errorDeps
                .map(dep => `- ${dep}: used by ${allDeps[dep].join(', ')}`)
                .sort()
                .join('\n'));
        return false;
    }
    console.log('  OK!\n');
    return true;
}
exports.validatePackageDependencies = validatePackageDependencies;
//# sourceMappingURL=validatePackageDependencies.js.map