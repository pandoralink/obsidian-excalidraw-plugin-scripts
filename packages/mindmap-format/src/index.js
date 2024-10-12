import { getNodeCurrentHeight } from "./utils/height";
import { formatTree } from "./utils/tree";

let settings = ea.getScriptSettings();
//set default values on first run
if (!settings["MindMap Format"]) {
  settings = {
    "MindMap Format": {
      value: "Excalidraw/MindMap Format",
      description:
        "This is prepared for the namespace of MindMap Format and does not need to be modified",
    },
    "default gap": {
      value: 10,
      description: "Interval size of element",
    },
    "curve length": {
      value: 40,
      description: "The length of the curve part in the mind map line",
    },
    "length between element and line": {
      value: 50,
      description:
        "The distance between the tail of the connection and the connecting elements of the mind map",
    },
  };
  ea.setScriptSettings(settings);
}

// default X coordinate of the middle point of the arc
const defaultDotX = Number(settings["curve length"].value);
// The default length from the middle point of the arc on the X axis
const defaultLengthWithCenterDot = Number(
  settings["length between element and line"].value
);
// Initial trimming distance of the end point on the Y axis
const initAdjLength = 4;
// default gap
const defaultGap = Number(settings["default gap"].value);

const generateTree = (elements) => {
  const elIdMap = new Map([[elements[0].id, elements[0]]]);
  let minXEl = elements[0];
  for (let i = 1; i < elements.length; i++) {
    elIdMap.set(elements[i].id, elements[i]);
    if (
      !(elements[i].type === "arrow" || elements[i].type === "line") &&
      elements[i].x < minXEl.x
    ) {
      minXEl = elements[i];
    }
  }
  const root = {
    el: minXEl,
    totalHeight: minXEl.height,
    topHeight: 0,
    bottomHeight: 0,
    linkChildrensLines: [],
    isLeafNode: false,
    children: [],
  };
  const preIdSet = new Set(); // The id_set of Elements that is already in the tree, avoid a dead cycle
  const dfsForTreeData = (root) => {
    if (preIdSet.has(root.el.id)) {
      return 0;
    }
    preIdSet.add(root.el.id);
    let lines = root.el.boundElements.filter(
      (el) =>
        el.type === "arrow" &&
        !preIdSet.has(el.id) &&
        elIdMap.get(el.id)?.startBinding?.elementId === root.el.id
    );
    if (lines.length === 0) {
      root.isLeafNode = true;
      root.totalHeight = root.el.height + 2 * defaultGap;
      [root.topHeight, root.bottomHeight] = [
        root.totalHeight / 2,
        root.totalHeight / 2,
      ];
      return root.totalHeight;
    } else {
      lines = lines.map((elementDesc) => {
        preIdSet.add(elementDesc.id);
        return elIdMap.get(elementDesc.id);
      });
    }

    const linkChildrensLines = [];
    lines.forEach((el) => {
      const line = el;
      if (
        line &&
        line.endBinding !== null &&
        line.endBinding !== undefined &&
        !preIdSet.has(elIdMap.get(line.endBinding.elementId).id)
      ) {
        const children = elIdMap.get(line.endBinding.elementId);
        linkChildrensLines.push(line);
        root.children.push({
          el: children,
          totalHeight: 0,
          topHeight: 0,
          bottomHeight: 0,
          linkChildrensLines: [],
          isLeafNode: false,
          children: [],
        });
      }
    });

    let totalHeight = 0;
    root.children.forEach((el) => (totalHeight += dfsForTreeData(el)));

    root.linkChildrensLines = linkChildrensLines;
    if (root.children.length === 0) {
      root.isLeafNode = true;
      root.totalHeight = root.el.height + 2 * defaultGap;
      [root.topHeight, root.bottomHeight] = [
        root.totalHeight / 2,
        root.totalHeight / 2,
      ];
    } else if (root.children.length > 0) {
      root.totalHeight = Math.max(root.el.height + 2 * defaultGap, totalHeight);
      [root.topHeight, root.bottomHeight] = getNodeCurrentHeight(
        root.children.map((item) => item.totalHeight)
      );
    }

    return totalHeight;
  };
  dfsForTreeData(root);
  const dfsForFormat = (root) => {
    if (root.isLeafNode) return;
    const childrenDescMap = new Map(
      root.children.map((item) => [item.el.id, item])
    );
    formatTree(
      root.el,
      root.linkChildrensLines,
      childrenDescMap,
      elIdMap,
      defaultGap,
      defaultDotX,
      defaultLengthWithCenterDot,
      initAdjLength
    );
    root.children.forEach((el) => dfsForFormat(el));
  };
  dfsForFormat(root);
};

const elements = ea.getViewSelectedElements();
generateTree(elements);

ea.copyViewElementsToEAforEditing(elements);
await ea.addElementsToView(false, false);
