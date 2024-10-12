const dotenv = require("dotenv");
const cleanup = require("rollup-plugin-cleanup");

const { addPrefix } = require("./plugins/rollup-plugin-add-prefix");
const { outputTarget } = require("./plugins/rollup-plugin-output-target");

dotenv.config({
  path: ".env.local",
});

const outputPath = "dist/Mindmap format.md";
const isProd = process.env.NODE_ENV === "production";

module.exports = {
  input: "src/index.js",
  plugins: [
    isProd && cleanup({ maxEmptyLines: 1 }),
    addPrefix(outputPath),
    outputTarget({
      isOutputTarget: process.env.NODE_ENV === "development",
      targetPath: process.env.TARGET_PATH,
    }),
  ],
  output: {
    file: outputPath,
    format: "es",
  },
};
