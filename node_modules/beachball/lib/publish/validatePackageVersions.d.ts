import { NpmOptions } from '../types/NpmOptions';
import { PackageInfos } from '../types/PackageInfo';
/**
 * Validate each package version being published doesn't already exist in the registry.
 */
export declare function validatePackageVersions(packagesToValidate: string[], packageInfos: PackageInfos, options: NpmOptions): Promise<boolean>;
//# sourceMappingURL=validatePackageVersions.d.ts.map