"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.callHook = void 0;
const path_1 = __importDefault(require("path"));
/**
 * Call a hook for each affected package. Does nothing if the hook is undefined.
 */
async function callHook(hook, affectedPackages, packageInfos) {
    if (!hook) {
        return;
    }
    for (const pkg of affectedPackages) {
        const packageInfo = packageInfos[pkg];
        const packagePath = path_1.default.dirname(packageInfo.packageJsonPath);
        await hook(packagePath, packageInfo.name, packageInfo.version, packageInfos);
    }
}
exports.callHook = callHook;
//# sourceMappingURL=callHook.js.map