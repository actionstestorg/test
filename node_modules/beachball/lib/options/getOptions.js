"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptions = void 0;
const getCliOptions_1 = require("./getCliOptions");
const getRepoOptions_1 = require("./getRepoOptions");
const getDefaultOptions_1 = require("./getDefaultOptions");
/**
 * Gets all repo level options (default + root options + cli options)
 */
function getOptions(argv) {
    const cliOptions = (0, getCliOptions_1.getCliOptions)(argv);
    return { ...(0, getDefaultOptions_1.getDefaultOptions)(), ...(0, getRepoOptions_1.getRepoOptions)(cliOptions), ...cliOptions };
}
exports.getOptions = getOptions;
//# sourceMappingURL=getOptions.js.map