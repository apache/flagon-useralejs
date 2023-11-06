const fs = require("fs");

const buildDir = "./build";

if (fs.existsSync(buildDir) && fs.statSync(buildDir).isDirectory()) {
  // Directory exists, so remove it
  fs.rmdirSync(buildDir, { recursive: true });
}
