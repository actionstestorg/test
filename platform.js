const fs = require("fs");
const path = require("path");

const filepath = path.join(__dirname, "test-results.json");

const data = fs.readFileSync(filepath, "utf8");
const results = JSON.parse(data);

for (let tests in results.testResults) {
  // eslint-disable-next-line no-console
  console.log(
    results.testResults[tests].assertionResults?.[0].ancestorTitles[0]
  );
  for (const assertionResult in results.testResults[tests].assertionResults) {
    if (
      results.testResults[tests].assertionResults[assertionResult].status ===
      "passed"
    ) {
      // eslint-disable-next-line no-console
      console.log(
        `\tTest passed: ${results.testResults[tests].assertionResults[assertionResult].title}`
      );
    } else if (
      results.testResults[tests].assertionResults[assertionResult].status ===
      "pending"
    ) {
      // eslint-disable-next-line no-console
      console.log(
        `\tTest skipped: ${results.testResults[tests].assertionResults[assertionResult].title}`
      );
    } else {
      // eslint-disable-next-line no-console
      console.log(
        `\tTest failed: ${results.testResults[tests].assertionResults[assertionResult].fullName}`
      );
      process.exit(1);
    }
  }
}
console.log("Summary:");
console.log(`\tTotal tests: ${results.numTotalTests}`);
console.log(`\tTotal passed: ${results.numPassedTests}`);
console.log(`\tTotal failed: ${results.numFailedTests}`);
console.log(`\tTotal skipped: ${results.numPendingTests}`);
console.log(`\tTotal suites: ${results.numTotalTestSuites}`);
console.log(`\tTotal passed: ${results.numPassedTestSuites}`);
