"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderJsonChangelog = void 0;
function renderJsonChangelog(changelog, previousChangelog) {
    const { name, date, ...rest } = changelog;
    return {
        name,
        entries: [
            {
                date: changelog.date.toUTCString(),
                ...rest,
            },
            ...(previousChangelog?.entries || []),
        ],
    };
}
exports.renderJsonChangelog = renderJsonChangelog;
//# sourceMappingURL=renderJsonChangelog.js.map