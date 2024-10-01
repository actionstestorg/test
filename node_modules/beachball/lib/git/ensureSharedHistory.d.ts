import { BeachballOptions } from '../types/BeachballOptions';
/**
 * Ensure that adequate history is available to check for changes between HEAD and `options.branch`.
 * Otherwise attempting to get changes will fail with an error "no merge base".
 * (This is mostly an issue with CI builds that use shallow clones.)
 *
 * Throws an error if history is inadequate and cannot be fixed.
 */
export declare function ensureSharedHistory(options: Pick<BeachballOptions, 'fetch' | 'path' | 'branch' | 'depth' | 'verbose'>): void;
//# sourceMappingURL=ensureSharedHistory.d.ts.map