const fs = require("fs");

module.exports = {
  outputTarget({ isOutputTarget = false, targetPath }) {
    return {
      name: "output-target",
      version: "1.0.0",
      writeBundle(_, bundle) {
        if (isOutputTarget && targetPath) {
          for (const key in bundle) {
            const chunk = bundle[key];
            if (chunk.isEntry) {
              fs.writeFileSync(targetPath, chunk.code);
            }
          }
        }
      },
    };
  },
};
