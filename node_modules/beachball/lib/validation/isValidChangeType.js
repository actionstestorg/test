"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidChangeType = void 0;
const changeTypes_1 = require("../changefile/changeTypes");
function isValidChangeType(changeType) {
    return changeTypes_1.SortedChangeTypes.includes(changeType);
}
exports.isValidChangeType = isValidChangeType;
//# sourceMappingURL=isValidChangeType.js.map