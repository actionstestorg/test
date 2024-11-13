/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

const fs = require("fs/promises");
const path = require("path");

let studioHoistVersionsPath;
const comments = [];
const pnpmWorkspaceYamlPath = path.join(__dirname, "..", "./pnpm-workspace.yaml");

detectPlatform();

const updatePnpmWorkspaceYaml = async () => {
  try {
    const { studioDependencies, pnpmWorkspaceYaml } = await read(studioHoistVersionsPath, pnpmWorkspaceYamlPath);
    const updatedPnpmWorkspaceYaml = await compare(studioDependencies, pnpmWorkspaceYaml);
    await write(pnpmWorkspaceYamlPath, updatedPnpmWorkspaceYaml);

    // eslint-disable-next-line no-console
    console.info(`pnpm-workspace.yaml has been successfully updated 🎉`);
  } catch (err) {
    console.error(`Updating of pnpm-workspace.yaml failed`);
    console.error(err);
  }
};

updatePnpmWorkspaceYaml();

/**
 * Reads the contents of the studioHoistVersionsPath and packageJsonPath files and returns them as objects.
 * @param {string} studioHoistVersionsPath - The path to the studioHoistVersions file.
 * @param {string} pnpmWorkspaceYamlPath - The path to the package.json file.
 * @returns {Promise<{ studioDependencies: object, pnpmWorkspaceYamlStr: object }>} - A promise that resolves to an object containing the studioDependencies and packageJson.
 */
async function read(studioHoistVersionsPath, pnpmWorkspaceYamlPath) {
  const studioDependenciesStr = await fs.readFile(studioHoistVersionsPath, "utf-8");
  const studioDependencies = JSON.parse(studioDependenciesStr);

  const pnpmWorkspaceYamlStr = await fs.readFile(pnpmWorkspaceYamlPath, "utf-8");
  const lines = pnpmWorkspaceYamlStr.split("\n").filter((line) => line.trim() !== "");
  const pnpmWorkspaceYaml = {};
  let currentCatalog = null;
  let prevMain = null;

  lines.forEach((line, lineNo) => {
    const indent = line.search(/\S|$/);
    line = line.trim();
    // If the line is a comment, add it to the comments array with the line number
    if (line.startsWith("#")) {
      comments.push({ lineNo, comment: line });
      return;
    }
    if (indent === 0 && line !== "") {
      line = line.replace(/:/g, "");
      pnpmWorkspaceYaml[line] = {};
      prevMain = line;
    } else if (indent === 2 && line[0] === "-") {
      if (!Array.isArray(pnpmWorkspaceYaml[prevMain])) {
        pnpmWorkspaceYaml[prevMain] = [];
      }
      pnpmWorkspaceYaml[prevMain].push(line);
    } else if (indent === 2 && line !== "") {
      const [key] = line.split(":").map((part) => part.trim().replace(/"/g, ""));
      pnpmWorkspaceYaml[prevMain][key] = {};
      currentCatalog = key;
    } else if (indent === 4 && line !== "") {
      const [key, value] = line.split(":").map((part) => part.trim().replace(/"/g, ""));
      pnpmWorkspaceYaml[prevMain][currentCatalog][key] = value;
    }
  });

  return { studioDependencies, pnpmWorkspaceYaml };
}

/**
 * Compares the versions of studio dependencies with the versions in the package.json file
 * and updates the package.json file with the latest versions if necessary.
 *
 * @param {Object} studioDependencies - An object containing the studio dependencies and their versions.
 * @param {Object} pnpmWorkspaceYaml - The package.json object.
 * @returns {Object} - The updated pnpm-workspace.yaml object.
 */
async function compare(studioDependencies, pnpmWorkspaceYaml) {
  for (const [name, version] of Object.entries(studioDependencies)) {
    for (const catalog in pnpmWorkspaceYaml.catalogs) {
      if (
        pnpmWorkspaceYaml.catalogs[catalog][name] !== undefined &&
        pnpmWorkspaceYaml.catalogs[catalog][name] !== version
      ) {
        pnpmWorkspaceYaml.catalogs[catalog][name] = version;
      }
    }
  }

  return pnpmWorkspaceYaml;
}

/**
 * Writes the updated package.json to the specified file path.
 *
 * @param {string} pnpmWorkspaceYamlPath - The file path of the package.json file.
 * @param {object} updatedPnpmWorkspaceYaml - The updated package.json object.
 * @returns {Promise<void>} - A promise that resolves when the file is written successfully.
 */
async function write(pnpmWorkspaceYamlPath, updatedPnpmWorkspaceYaml) {
  const yamlString = jsonToYaml(updatedPnpmWorkspaceYaml);
  await fs.writeFile(pnpmWorkspaceYamlPath, yamlString);
}

// Convert the json file into yaml format
let lineNo = 0;
function jsonToYaml(obj, indent = 0) {
  let yaml = "";
  const spaces = "  ".repeat(indent);

  for (const key in obj) {
    // Allows to add comments to the yaml file on correct line
    if (comments.length && comments[0].lineNo === lineNo) {
      yaml += `${spaces}${comments[0].comment}\n`;
      comments.shift();
      lineNo++;
    }
    lineNo++;

    if (Array.isArray(obj[key])) {
      yaml += `${spaces}${key}:\n`;
      obj[key].forEach((item) => {
        if (typeof item === "object") {
          yaml += `${spaces}\n${jsonToYaml(item, indent + 1)}`;
        } else {
          yaml += `${spaces}  ${item}\n`;
          lineNo++;
        }
      });
    } else if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      yaml += `${spaces}${key}:\n${jsonToYaml(obj[key], indent + 1)}`;
    } else {
      yaml += `${spaces}"${key}": "${obj[key].split(" ")[0]}"\n`;
    }
  }

  return yaml;
}

// Determine the path to the hoist-versions.json file based on the platform
function detectPlatform() {
  const os = require("os");
  const platform = os.platform();

  switch (platform) {
    case "win32":
      const appDataPath = process.env.APPDATA;
      const localAppData = appDataPath.slice(0, appDataPath.lastIndexOf("\\"));
      studioHoistVersionsPath = path.join(
        localAppData + "\\Local\\Programs\\Bentley\\iTwinStudioforDevelopers\\resources\\app\\hoist-versions.json"
      );
      break;
    case "darwin":
      studioHoistVersionsPath = path.join(
        "/Applications/iTwinStudioforDevelopers.app/Contents/Resources/app/hoist-versions.json"
      );
      break;
    case "linux":
      // Untested yet but path is correct
      studioHoistVersionsPath = "/opt/iTwin Studio for Developers/resources/app/hoist-versions.json";
      break;
    default:
      throw new Error(`Running on an unsupported platform: ${platform}`);
  }
}
