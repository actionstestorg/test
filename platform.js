const fs = require('fs');
const path = require('path');

const filepath = path.join(__dirname, "test-results.json");

const data = fs.readFileSync(filepath, 'utf8');
const results = JSON.parse(data);

if (results.numFailedTests === 0 &&
    results.numFailedTestSuites === 0 &&
    results.numPassedTests > 0 &&
    results.numPassedTestSuites > 0 &&
    results.success === true) {
      for(const result in results.testResults) {
        // eslint-disable-next-line no-console
        console.log(result.assertionResults[0].ancestorTitles);
        for(const test in result.assertionResults) {
          if(test.status !== "passed") {
            // eslint-disable-next-line no-console
            console.error(`Test failed: ${test.fullName}`);
            process.exit(1);
        }
        else{
          // eslint-disable-next-line no-console
          console.log(`Test passed: ${test.fullName}`);
        }
      }
    }
    // eslint-disable-next-line no-console
    console.log("All tests passed");
  }
  else {
    // eslint-disable-next-line no-console
    console.log("Some tests failed");
    process.exit(1);
  }
