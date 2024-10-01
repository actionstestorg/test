"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.singleLineStringify = exports.formatList = void 0;
/** Format strings as a bulleted list with line breaks */
function formatList(items) {
    return items.map(item => `- ${item}`).join('\n');
}
exports.formatList = formatList;
/**
 * Format an object on a single line with spaces between the properties and brackets
 * (similar to `JSON.stringify(obj, null, 2)` but without the line breaks).
 */
function singleLineStringify(obj) {
    return JSON.stringify(obj, null, 2).replace(/\n\s*/g, ' ');
}
exports.singleLineStringify = singleLineStringify;
//# sourceMappingURL=format.js.map