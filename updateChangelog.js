const fs = require('fs');
const path = require('path');

// Path to the changelog file
const changelogPath = path.join(__dirname, 'changelog.md');

// Read the change file created by beachball
const changeFilePath = path.join(__dirname, 'change', 'change.json');
const changeData = JSON.parse(fs.readFileSync(changeFilePath, 'utf8'));

// Extract the version upgrade information
const { versionUpgrade, version } = changeData;

// Format the changelog entry
let changelogEntry = `## ${new Date().toISOString().split('T')[0]}\n`;
if (versionUpgrade === 'yes') {
  changelogEntry += `- Version upgraded to ${version}\n`;
} else {
  changelogEntry += `- No version upgrade\n`;
}

// Append the changelog entry to the changelog file
fs.appendFileSync(changelogPath, `${changelogEntry}\n`, 'utf8');

console.log('Changelog updated successfully.');