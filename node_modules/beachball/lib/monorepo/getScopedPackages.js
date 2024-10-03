"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScopedPackages = void 0;
const path_1 = __importDefault(require("path"));
const isPathIncluded_1 = require("./isPathIncluded");
function getScopedPackages(options, packageInfos) {
    const { scope, path: cwd } = options;
    if (!scope) {
        return Object.keys(packageInfos);
    }
    let includeScopes = scope.filter(s => !s.startsWith('!'));
    // If there were no include scopes, include all paths by default
    includeScopes = includeScopes.length ? includeScopes : true;
    const excludeScopes = scope.filter(s => s.startsWith('!'));
    return Object.keys(packageInfos).filter(pkgName => {
        const packagePath = path_1.default.dirname(packageInfos[pkgName].packageJsonPath);
        return (0, isPathIncluded_1.isPathIncluded)(path_1.default.relative(cwd, packagePath), includeScopes, excludeScopes);
    });
}
exports.getScopedPackages = getScopedPackages;
//# sourceMappingURL=getScopedPackages.js.map