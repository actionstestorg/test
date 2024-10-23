const fs = require('fs');
const path = require('path');

const filepath = path.join(__dirname, "test-results.json");

const data = fs.readFileSync(filepath, 'utf8');
const results = JSON.parse(data);

if(results.numFailedTests === 0 && results.numFailedTestSuites === 0) {
  console.log("All tests passed");
}
else{
    console.log("Some tests failed");
    process.exit(1);
}
