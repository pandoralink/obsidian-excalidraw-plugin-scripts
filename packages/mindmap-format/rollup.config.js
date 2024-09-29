const { addPrefix } = require("./plugins/rollup-plugin-add-prefix");
const { outputTarget } = require("./plugins/rollup-plugin-output-target");

const outputPath = "dist/Mindmap format.md";

module.exports = {
  input: "index.js",
  plugins: [
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
