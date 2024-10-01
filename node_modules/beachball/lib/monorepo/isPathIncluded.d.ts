/**
 * Check if a relative path should be included given include and exclude patterns using minimatch.
 * @param relativePath Relative path to check.
 * @param include Include pattern(s). If `true`, include all paths except those excluded.
 * @param exclude Exclude pattern(s). Currently these must be **negated** patterns:
 * e.g. if you want to exclude `packages/foo`, you must specify `exclude` as `!packages/foo`.
 * (This will be fixed in a future major version.)
 */
export declare function isPathIncluded(relativePath: string, include: string | string[] | true, exclude?: string | string[]): boolean;
//# sourceMappingURL=isPathIncluded.d.ts.map