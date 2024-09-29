const fs = require("fs");

module.exports = {
  addPrefix(outputPath = "dist/Mindmap format.md") {
    return {
      name: "add-prefix",
      version: "1.0.0",
      writeBundle: (options, bundle) => {
        const templateContent = fs.readFileSync("./template.txt", "utf8");

        for (const key in bundle) {
          const chunk = bundle[key];
          if (chunk.isEntry) {
            const content = templateContent + chunk.code;
            fs.writeFileSync(outputPath, content);
          }
        }
      },
    };
  },
};
