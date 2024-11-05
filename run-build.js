const { exec } = require("child_process");

const v8 = require("v8");
const buildCommand = "pnpm list";

const child = exec(buildCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
    return;
  }
  console.log(`Stdout: ${stdout}`);
});

child.on("exit", () => {
  const memoryUsage = process.memoryUsage();
  console.log(`RSS: ${memoryUsage.rss}`);
  console.log(`Heap Total: ${memoryUsage.heapTotal}`);
  console.log(`Heap Used: ${memoryUsage.heapUsed}`);
  console.log(`External: ${memoryUsage.external}`);
  console.log(`Heap Info: ${JSON.stringify(v8.getHeapStatistics())}`);
});