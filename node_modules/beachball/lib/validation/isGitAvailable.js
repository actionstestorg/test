"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGitAvailable = void 0;
const workspace_tools_1 = require("workspace-tools");
function isGitAvailable(cwd) {
    const result = (0, workspace_tools_1.git)(['--version']);
    try {
        return result.success && !!(0, workspace_tools_1.findGitRoot)(cwd);
    }
    catch (err) {
        return false;
    }
}
exports.isGitAvailable = isGitAvailable;
//# sourceMappingURL=isGitAvailable.js.map