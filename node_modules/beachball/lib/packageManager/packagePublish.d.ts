import { PackageInfo } from '../types/PackageInfo';
import { NpmResult } from './npm';
import { BeachballOptions } from '../types/BeachballOptions';
import { NpmOptions } from '../types/NpmOptions';
/**
 * Attempt to publish the package with retries. Returns the result of the final npm publish call
 * (mainly for tests; the real code just checks `result.success`).
 */
export declare function packagePublish(packageInfo: PackageInfo, options: NpmOptions & Pick<BeachballOptions, 'retries'>): Promise<NpmResult>;
//# sourceMappingURL=packagePublish.d.ts.map