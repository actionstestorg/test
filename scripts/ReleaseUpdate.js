const {updatePnpmWorkspaceYaml} = require("./updatePackageVersions");
const args = process.argv.slice(2);
let studioHoistVersionsPath = args[0];
updatePnpmWorkspaceYaml(studioHoistVersionsPath);