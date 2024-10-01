"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRepoOptions = void 0;
const cosmiconfig_1 = require("cosmiconfig");
const workspace_tools_1 = require("workspace-tools");
const env_1 = require("../env");
let cachedRepoOptions = new Map();
function getRepoOptions(cliOptions) {
    const { configPath, path: cwd, branch } = cliOptions;
    if (!env_1.env.beachballDisableCache && cachedRepoOptions.has(cliOptions)) {
        return cachedRepoOptions.get(cliOptions);
    }
    let repoOptions;
    if (configPath) {
        repoOptions = tryLoadConfig(configPath);
        if (!repoOptions) {
            console.error(`Config file "${configPath}" could not be loaded`);
            process.exit(1);
        }
    }
    else {
        repoOptions = trySearchConfig() || {};
    }
    // Only if the branch isn't specified in cliOptions (which takes precedence), fix it up or add it
    // in repoOptions. (We don't want to do the getDefaultRemoteBranch() lookup unconditionally to
    // avoid potential for log messages/errors which aren't relevant if the branch was specified on
    // the command line.)
    if (!branch) {
        const verbose = repoOptions.verbose;
        if (repoOptions.branch && !repoOptions.branch.includes('/')) {
            // Add a remote to the branch if it's not already included
            repoOptions.branch = (0, workspace_tools_1.getDefaultRemoteBranch)({ branch: repoOptions.branch, cwd, verbose });
        }
        else if (!repoOptions.branch) {
            // Branch is not specified at all. Add in the default remote and branch.
            repoOptions.branch = (0, workspace_tools_1.getDefaultRemoteBranch)({ cwd, verbose });
        }
    }
    cachedRepoOptions.set(cliOptions, repoOptions);
    return repoOptions;
}
exports.getRepoOptions = getRepoOptions;
function tryLoadConfig(configPath) {
    const configExplorer = (0, cosmiconfig_1.cosmiconfigSync)('beachball');
    const loadResults = configExplorer.load(configPath);
    return (loadResults && loadResults.config) || null;
}
function trySearchConfig() {
    const configExplorer = (0, cosmiconfig_1.cosmiconfigSync)('beachball');
    const searchResults = configExplorer.search();
    return (searchResults && searchResults.config) || null;
}
//# sourceMappingURL=getRepoOptions.js.map