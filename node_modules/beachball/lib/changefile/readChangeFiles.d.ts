import { ChangeSet } from '../types/ChangeInfo';
import { BeachballOptions } from '../types/BeachballOptions';
import { PackageInfos } from '../types/PackageInfo';
/**
 * Read change files, excluding any changes for packages that are:
 * - out of scope (as defined in `options.scope`)
 * - private
 * - nonexistent
 *
 * The changes will also be transformed if `options.transform.changeFiles` is provided.
 *
 * Changes from grouped change files will be flattened into individual entries in the returned array
 * (so it's possible that multiple entries will have the same filename).
 */
export declare function readChangeFiles(options: BeachballOptions, packageInfos: PackageInfos): ChangeSet;
//# sourceMappingURL=readChangeFiles.d.ts.map