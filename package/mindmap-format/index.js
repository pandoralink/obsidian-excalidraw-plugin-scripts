/*
```javascript
*/

// 弧线中间点默认的 X 坐标
const defaultDotX = 40;
// 弧线中间点默认的 Y 坐标
const defaultDotY = 40;
// 在 X 轴上距离弧线中间点的默认长度
const defaultLengthWithCenterDot = 50;
// 弧线中间点的初始半径
const initRadius = 40;
// 结束点在 Y 轴上的初始微调距离
const initAdjLength = 4;
// 默认步长
const defaultStep = 40;

const setCenter = (parent, line) => {
  line.x = parent.x + parent.width;
  line.y = parent.y + parent.height / 2;
};

/**
 * 返回步长为 step 的下一个半径
 * @param {number} initX 初始 X 值
 * @param {number} initY 初始 Y 值
 * @param {number} step 步长
 * @param {number} [index=0] 倍数，默认为 0，需为 0,1,2...,n 正整数
 */
const getNextRadius = (initX, initY, step, index = 0) => {
  return (
    (Math.pow(initY, 2) +
      2 * initY * step * index +
      Math.pow(step * index, 2) +
      Math.pow(initX, 2)) /
    (2 * initX)
  );
};

/**
 * 设置弧线中间点
 * @param {any} lineEl Excalidraw 线段元素
 * @param {number} [radius=40] 半径，默认为 40
 * @param {number} [ratio=1] ，结束点在 Y 轴上的初始微调距离的系数，默认为 1
 */
const setCenterDotOnLine = (lineEl, radius = 40, ratio = 1) => {
  if (lineEl.points.length < 3) {
    lineEl.points.splice(1, 0, [defaultDotX, radius]);
  } else if (lineEl.points.length === 3) {
    lineEl.points[1] = [defaultDotX, radius];
  } else {
    lineEl.points.splice(2, lineEl.points.length - 3);
    lineEl.points[1] = [defaultDotX, radius];
  }
  lineEl.points[2][0] = lineEl.points[1][0] + defaultLengthWithCenterDot;
  // 由于 Excalidraw 提供的弧线在设置中间点后还会有一定的弧度
  // 因此需要调整 4 距离保证第二线段的直线程度
  lineEl.points[2][1] = lineEl.points[1][1] + initAdjLength * ratio * 0.8;
};

// TODO: 使用间隔 gap

/**
 * 设置弧线中间点
 * @param {any} lineEl Excalidraw 线段元素
 * @param {number} [radius=40] 半径，默认为 40
 * @param {number} [ratio=1] ，结束点在 Y 轴上的初始微调距离的系数，默认为 1
 */
const setTopCurveDotOnLine = (lineEl, radius = 40, ratio = 1) => {
  if (lineEl.points.length < 3) {
    lineEl.points.splice(1, 0, [
      defaultDotX,
      lineEl.points[0][1] - ratio * radius,
    ]);
  } else if (lineEl.points.length === 3) {
    lineEl.points[1] = [defaultDotX, lineEl.points[0][1] - ratio * radius];
  } else {
    lineEl.points.splice(2, lineEl.points.length - 3);
    lineEl.points[1] = [defaultDotX, lineEl.points[0][1] - ratio * radius];
  }
  lineEl.points[2][0] = lineEl.points[1][0] + defaultLengthWithCenterDot;
  // 由于 Excalidraw 提供的弧线在设置中间点后还会有一定的弧度
  // 因此需要调整 4 距离保证第二线段的直线程度
  lineEl.points[2][1] = lineEl.points[1][1] - initAdjLength * ratio * 0.8;
};

const setMidCurveDotOnLine = (lineEl) => {
  if (lineEl.points.length < 3) {
    lineEl.points.splice(1, 0, [defaultDotX, lineEl.points[0][1]]);
  } else if (lineEl.points.length === 3) {
    lineEl.points[1] = [defaultDotX, lineEl.points[0][1]];
  } else {
    lineEl.points.splice(2, lineEl.points.length - 3);
    lineEl.points[1] = [defaultDotX, lineEl.points[0][1]];
  }
  lineEl.points[2][0] = lineEl.points[1][0] + defaultLengthWithCenterDot;
  lineEl.points[2][1] = lineEl.points[1][1];
};

/**
 * 设置弧线中间点
 * @param {any} lineEl Excalidraw 线段元素
 * @param {number} [radius=40] 半径，默认为 40
 * @param {number} [ratio=1] ，结束点在 Y 轴上的初始微调距离的系数，默认为 1
 */
const setBottomCurveDotOnLine = (lineEl, radius = 40, ratio = 1) => {
  if (lineEl.points.length < 3) {
    lineEl.points.splice(1, 0, [
      defaultDotX,
      lineEl.points[0][1] + ratio * radius,
    ]);
  } else if (lineEl.points.length === 3) {
    lineEl.points[1] = [defaultDotX, radius];
  } else {
    lineEl.points.splice(2, lineEl.points.length - 3);
    lineEl.points[1] = [defaultDotX, lineEl.points[0][1] + ratio * radius];
  }
  lineEl.points[2][0] = lineEl.points[1][0] + defaultLengthWithCenterDot;
  // 由于 Excalidraw 提供的弧线在设置中间点后还会有一定的弧度
  // 因此需要调整 4 距离保证第二线段的直线程度
  lineEl.points[2][1] = lineEl.points[1][1] + initAdjLength * ratio * 0.8;
};

const setTextXY = (rect, text) => {
  text.x = rect.x + (rect.width - text.width) / 2;
  text.y = rect.y + (rect.height - text.height) / 2;
};

const setChildrenXY = (parent, children, line, elementsMap) => {
  children.x = parent.x + parent.width + line.points[2][0];
  children.y =
    parent.y + parent.height / 2 + line.points[2][1] - children.height / 2;
  if (
    ["rectangle", "diamond", "ellipse"].includes(children.type) &&
    ![null, undefined].includes(children.boundElements)
  ) {
    const textDesc = children.boundElements.filter(
      (el) => el.type === "text"
    )[0];
    if (textDesc !== undefined) {
      const textEl = elementsMap.get(textDesc.id);
      setTextXY(children, textEl);
    }
  }
};

/**
 * 格式化单层树
 * @param {any} parent
 * @param {Array} lines
 * @param {Map} elementsMap
 */
const formatTree = (parent, lines, elementsMap) => {
  lines.forEach((item) => setCenter(parent, item));

  const isEven = lines.length % 2 === 0;
  const mid = Math.floor(lines.length / 2);
  lines.forEach((item, index) => {
    if (isEven) {
      if (index < mid) setTopCurveDotOnLine(item, defaultStep, index + 1);
      else setBottomCurveDotOnLine(item, defaultStep, index - mid + 1);
    } else {
      if (index < mid) setTopCurveDotOnLine(item, defaultStep, index + 1);
      else if (index === mid) setMidCurveDotOnLine(item);
      else setBottomCurveDotOnLine(item, defaultStep, index - mid + 1);
    }
    // setCenterDotOnLine(item, ++index * defaultStep, ++index);
  });
  lines.forEach((item) => {
    if (item.endBinding !== null) {
      setChildrenXY(
        parent,
        elementsMap.get(item.endBinding.elementId),
        item,
        elementsMap
      );
    }
  });
};

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
    linkChildrensLines: [],
    isLeafNode: false,
    children: [],
  };
  const preIdSet = new Set([root.el.id]); // 已经在树中的 El，避免死循环
  const dfs = (root) => {
    preIdSet.add(root.el.id);
    let lines = root.el.boundElements.filter(
      (el) =>
        (el.type === "arrow" || el.type === "line") && !preIdSet.has(el.id)
    );
    if (lines.length === 0) {
      root.isLeafNode = true;
      return root.el.height;
    } else {
      lines = lines.map((elementDesc) => {
        preIdSet.add(elementDesc.id);
        return elIdMap.get(elementDesc.id);
      });
    }

    const linkChildrensLines = [];
    lines.forEach((el) => {
      const line = el;
      if (line && line.endBinding !== null && line.endBinding !== undefined) {
        const children = elIdMap.get(line.endBinding.elementId);
        linkChildrensLines.push(line);
        root.children.push({
          el: children,
          totalHeight: children.height,
          linkChildrensLines: [],
          isLeafNode: false,
          children: [],
        });
      }
    });
    let totalHeight = 0;
    root.children.forEach((el) => (totalHeight += dfs(el)));

    root.linkChildrensLines = linkChildrensLines;
    if (root.children.length === 0) {
      root.isLeafNode = true;
      root.totalHeight = root.el.height;
    } else if (root.children.length > 0) {
      root.totalHeight = Math.max(root.el.height, totalHeight);
    }
    return totalHeight;
  };
  dfs(root);
  const dfsForFormat = (root) => {
    if (root.isLeafNode) return;
    formatTree(root.el, root.linkChildrensLines, elIdMap);
    root.children.forEach((el) => dfsForFormat(el));
  };
  dfsForFormat(root);
};

const elements = ea.getViewSelectedElements();
generateTree(elements);

ea.copyViewElementsToEAforEditing(elements);
ea.addElementsToView();
