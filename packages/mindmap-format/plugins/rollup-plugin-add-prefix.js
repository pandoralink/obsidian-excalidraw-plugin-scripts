const fs = require("fs");

module.exports = {
  addPrefix(outputPath = "dist/Mindmap format.md") {
    return {
      name: "add-prefix",
      version: "1.0.1",
      generateBundle(_, bundle) {
        const templateContent = fs.readFileSync("./template.txt", "utf8");

        for (const key in bundle) {
          const chunk = bundle[key];
          if (chunk.isEntry) {
            chunk.code = templateContent + chunk.code;
          }
        }
      },
    };
  },
};
