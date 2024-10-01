import { PackageChangelog } from '../types/ChangeLog';
import { PackageInfo } from '../types/PackageInfo';
/**
 * Merge multiple package changelogs into one.
 * `name` and `version` will use the values from `primaryPackage`'s changelog.
 * `comments` are merged. `date` will be now.
 */
export declare function mergeChangelogs(changelogs: PackageChangelog[], primaryPackage: PackageInfo): PackageChangelog | undefined;
//# sourceMappingURL=mergeChangelogs.d.ts.map