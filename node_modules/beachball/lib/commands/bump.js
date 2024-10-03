"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bump = void 0;
const gatherBumpInfo_1 = require("../bump/gatherBumpInfo");
const performBump_1 = require("../bump/performBump");
const getPackageInfos_1 = require("../monorepo/getPackageInfos");
async function bump(options) {
    const bumpInfo = (0, gatherBumpInfo_1.gatherBumpInfo)(options, (0, getPackageInfos_1.getPackageInfos)(options.path));
    // The bumpInfo is returned for testing
    return (0, performBump_1.performBump)(bumpInfo, options);
}
exports.bump = bump;
//# sourceMappingURL=bump.js.map