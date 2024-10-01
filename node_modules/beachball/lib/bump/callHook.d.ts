import { HooksOptions } from '../types/BeachballOptions';
import { PackageInfos } from '../types/PackageInfo';
/**
 * Call a hook for each affected package. Does nothing if the hook is undefined.
 */
export declare function callHook(hook: HooksOptions['prebump' | 'postbump' | 'prepublish' | 'postpublish'], affectedPackages: Iterable<string>, packageInfos: PackageInfos): Promise<void>;
//# sourceMappingURL=callHook.d.ts.map