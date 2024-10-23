const fs = require("fs");
const path = require("path");

const filepath = path.join(__dirname, "test-results.json");

const data = fs.readFileSync(filepath, "utf8");
const results = JSON.parse(data);

if (
  results.numFailedTests === 0 &&
  results.numFailedTestSuites === 0 &&
  results.numPassedTests > 0 &&
  results.numPassedTestSuites > 0 &&
  results.success === true
) {
  for (let tests in results.testResults) {
    // eslint-disable-next-line no-console
    console.log(results.testResults[tests].assertionResults?.[0].ancestorTitles[0]);
    for (const assertionResult in results.testResults[tests].assertionResults) {
      if (results.testResults[tests].assertionResults[assertionResult].status === "passed")
        {
            // eslint-disable-next-line no-console
            console.log(`\tTest passed: ${results.testResults[tests].assertionResults[assertionResult].title}`);
          }
        else if (results.testResults[tests].assertionResults[assertionResult].status === "pending") {
        // eslint-disable-next-line no-console
        console.log(`\tTest skipped: ${results.testResults[tests].assertionResults[assertionResult].title}`);
        
      }else
      {
        // eslint-disable-next-line no-console
        console.error(`\tTest failed: ${results.testResults[tests].assertionResults[assertionResult].fullName}`);
        process.exit(1);
      }
    }
  }
  // eslint-disable-next-line no-console
  console.log("All tests passed");
} else {
  // eslint-disable-next-line no-console
  console.log("Some tests failed");
  process.exit(1);
}
