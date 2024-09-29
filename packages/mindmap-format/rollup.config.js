const { addPrefix } = require("./plugins/rollup-plugin-add-prefix");

const outputPath = "dist/Mindmap format.md";

module.exports = {
  input: "index.js",
  plugins: [addPrefix(outputPath)],
  output: {
    file: outputPath,
    format: "es",
  },
};
