"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNpmAuthArgs = exports.getNpmPublishArgs = void 0;
function getNpmPublishArgs(packageInfo, options) {
    const { registry, token, authType, access } = options;
    const pkgCombinedOptions = packageInfo.combinedOptions;
    const args = [
        'publish',
        '--registry',
        registry,
        '--tag',
        pkgCombinedOptions.tag || pkgCombinedOptions.defaultNpmTag || 'latest',
        '--loglevel',
        options.verbose ? 'notice' : 'warn',
        ...getNpmAuthArgs(registry, token, authType),
    ];
    if (access && packageInfo.name[0] === '@') {
        args.push('--access', access);
    }
    return args;
}
exports.getNpmPublishArgs = getNpmPublishArgs;
function getNpmAuthArgs(registry, token, authType) {
    if (!token) {
        return [];
    }
    const npmKeyword = authType === 'password' ? '_password' : '_authToken';
    const shorthand = registry.substring(registry.indexOf('//'));
    return [`--${shorthand}:${npmKeyword}=${token}`];
}
exports.getNpmAuthArgs = getNpmAuthArgs;
//# sourceMappingURL=npmArgs.js.map