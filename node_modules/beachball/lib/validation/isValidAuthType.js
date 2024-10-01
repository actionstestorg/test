"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidAuthType = void 0;
function isValidAuthType(authType) {
    const authTypes = ['authtoken', 'password'];
    return authTypes.includes(authType);
}
exports.isValidAuthType = isValidAuthType;
//# sourceMappingURL=isValidAuthType.js.map