import { PackageInfos } from '../types/PackageInfo';
/**
 * Topologically sort the packages based on their dependency graph.
 * Dependency comes first before dependent.
 * @param packages Packages to be sorted.
 * @param packageInfos PackagesInfos for the sorted packages.
 */
export declare function toposortPackages(packages: string[], packageInfos: PackageInfos): string[];
//# sourceMappingURL=toposortPackages.d.ts.map