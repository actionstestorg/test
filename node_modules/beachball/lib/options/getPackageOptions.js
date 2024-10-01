"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackageOptions = exports.getCombinedPackageOptions = void 0;
const cosmiconfig_1 = require("cosmiconfig");
const getCliOptions_1 = require("./getCliOptions");
const getRepoOptions_1 = require("./getRepoOptions");
const getDefaultOptions_1 = require("./getDefaultOptions");
const path_1 = __importDefault(require("path"));
const env_1 = require("../env");
/**
 * Gets all package level options (default + root options + package options + cli options)
 * This function inherits packageOptions from the repoOptions
 */
function getCombinedPackageOptions(actualPackageOptions) {
    const defaultOptions = (0, getDefaultOptions_1.getDefaultOptions)();
    // Don't use options from process.argv or the beachball repo in tests
    const cliOptions = !env_1.env.isJest && (0, getCliOptions_1.getCliOptions)(process.argv);
    const repoOptions = cliOptions && (0, getRepoOptions_1.getRepoOptions)(cliOptions);
    return {
        ...defaultOptions,
        ...repoOptions,
        ...actualPackageOptions,
        ...cliOptions,
    };
}
exports.getCombinedPackageOptions = getCombinedPackageOptions;
/**
 * Gets all the package options from the configuration file of the package itself without inheritance
 */
function getPackageOptions(packagePath) {
    const configExplorer = (0, cosmiconfig_1.cosmiconfigSync)('beachball', { cache: false });
    try {
        const results = configExplorer.load(path_1.default.join(packagePath, 'package.json'));
        return (results && results.config) || {};
    }
    catch (e) {
        // File does not exist, returns the default packageOptions
        return {};
    }
}
exports.getPackageOptions = getPackageOptions;
//# sourceMappingURL=getPackageOptions.js.map