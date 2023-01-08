// 弧线中间点默认的 X 坐标
const defaultDotX = 40;
// 弧线中间点默认的 Y 坐标
const defaultDotY = 40;
// 在 X 轴上距离弧线中间点的默认长度
const defaultLengthWithCenterDot = 50;
// 弧线中间点的初始半径
const initRadius = 40;
// 结束点在 Y 轴上的初始微调距离
const initAdjLength = 5;

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

// TODO：确立弧线前先过滤除起始两点外的其它中间节点
/**
 * 设置弧线中间点
 * @param {any} lineEl Excalidraw 线段元素
 * @param {number} [radius=40] 半径，默认为 40
 * @param {number} [ratio=1] ，结束点在 Y 轴上的初始微调距离的系数，默认为 1
 */
const setCenterDotOnLine = (lineEl, radius = 40, ratio = 1) => {
  if (lineEl.points.length < 3) {
    lineEl.points.splice(1, 0, [
      defaultDotX,
      Math.sqrt(Math.pow(radius, 2) - Math.pow(defaultDotX - radius, 2)),
    ]);
  } else if (lineEl.points.length === 3) {
    lineEl.points[1][0] = defaultDotX;
    lineEl.points[1][1] = Math.sqrt(
      Math.pow(radius, 2) - Math.pow(defaultDotX - radius, 2)
    );
  }
  lineEl.points[2][0] = lineEl.points[1][0] + defaultLengthWithCenterDot;
  // 由于 Excalidraw 提供的弧线在设置中间点后还会有一定的弧度
  // 因此需要调整 4 距离保证第二线段的直线程度
  lineEl.points[2][1] = lineEl.points[1][1] + initAdjLength * ratio * 0.9;
};

const setRectText = (rect, text) => {
  text.x = rect.x + (rect.width - text.width) / 2;
  text.y = rect.y + (rect.height - text.height) / 2;
};

const setChildrenXY = (parent, children, line, elements) => {
  children.x = parent.x + parent.width + line.points[2][0];
  children.y =
    parent.y + parent.height / 2 + line.points[2][1] - children.height / 2;
  console.log(children.x, children.y);
  const textDesc = children.boundElements.filter((el) => el.type === "text")[0];
  const textEl = elements.filter((el) => el.id === textDesc.id)[0];
  setRectText(children, textEl);
};

// TODO: 解决多层树问题
const elements = ea.getViewSelectedElements();
const parentEl = elements[0];
ea.copyViewElementsToEAforEditing(elements);
const lines = elements.filter(
  (el) => el.type === "arrow" || el.type === "line"
);
const rectangleChildrens = elements.filter(
  (el) => el.type === "rectangle" && el.id !== parentEl.id
);

console.log(elements);
lines.forEach((item) => setCenter(elements[0], item));
lines.forEach((item, index) =>
  setCenterDotOnLine(
    item,
    getNextRadius(defaultDotX, defaultDotY, 40, index),
    ++index
  )
);
lines.forEach((item, index) => {
  if (item.endBinding !== null) {
    // TODO: 检验是否为空/或者预先存储 id-Map
    const target = rectangleChildrens.filter(
      (el) => el.id === item.endBinding.elementId
    )[0];
    setChildrenXY(parentEl, target, item, elements);
  }
});
console.log(lines);

ea.copyViewElementsToEAforEditing(elements);
ea.copyViewElementsToEAforEditing(rectangleChildrens);
ea.addElementsToView();
