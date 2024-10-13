/**
 * set the middle point of curve
 * @param {any} lineEl the line element of excalidraw
 * @param {number} height height of dot on Y axis
 * @param {number} [ratio=1] ，coefficient of the initial trimming distance of the end point on the Y axis, default is 1
 * @param {number} dotX X coordinate of the middle point of the arc
 * @param {number} lengthWithCenterDot The length from the middle point of the arc on the X axis
 * @param {number} initAdjLength Initial trimming distance of the end point on the Y axis
 */
const setTopCurveDotOnLine = (
  lineEl,
  height,
  ratio = 1,
  dotX,
  lengthWithCenterDot,
  initAdjLength
) => {
  if (lineEl.points.length < 3) {
    lineEl.points.splice(1, 0, [dotX, lineEl.points[0][1] - height]);
  } else if (lineEl.points.length === 3) {
    lineEl.points[1] = [dotX, lineEl.points[0][1] - height];
  } else if(lineEl.points.length === 4) {
    // 简单判断 lineEl 的类型，默认 4 个点就是 Elbow arrow
    // excalidraw 似乎能够拿到 arrow 的确切类型，即使设置了 lineEl 的点为 3 个后，再次拖动也会变成 Elbow arrow
    lineEl.points[1] = [dotX, lineEl.points[0][1]];
    lineEl.points[2] = [dotX, lineEl.points[0][1] - height];
    lineEl.points[3][0] = lineEl.points[2][0] + lengthWithCenterDot;
    lineEl.points[3][1] = lineEl.points[2][1];
    return;
  } else {
    lineEl.points.splice(2, lineEl.points.length - 3);
    lineEl.points[1] = [dotX, lineEl.points[0][1] - height];
  }
  lineEl.points[2][0] = lineEl.points[1][0] + lengthWithCenterDot;
  // adjust the curvature of the second line segment
  lineEl.points[2][1] = lineEl.points[1][1] - initAdjLength * ratio * 0.8;
};

const setMidCurveDotOnLine = (lineEl, dotX, lengthWithCenterDot) => {
  if (lineEl.points.length < 3) {
    lineEl.points.splice(1, 0, [dotX, lineEl.points[0][1]]);
  } else if (lineEl.points.length === 3) {
    lineEl.points[1] = [dotX, lineEl.points[0][1]];
  } else {
    lineEl.points.splice(2, lineEl.points.length - 3);
    lineEl.points[1] = [dotX, lineEl.points[0][1]];
  }
  lineEl.points[2][0] = lineEl.points[1][0] + lengthWithCenterDot;
  lineEl.points[2][1] = lineEl.points[1][1];
};

/**
 * set the middle point of curve
 * @param {any} lineEl the line element of excalidraw
 * @param {number} height height of dot on Y axis
 * @param {number} [ratio=1] ，coefficient of the initial trimming distance of the end point on the Y axis, default is 1
 * @param {number} dotX X coordinate of the middle point of the arc
 * @param {number} lengthWithCenterDot The length from the middle point of the arc on the X axis
 * @param {number} initAdjLength Initial trimming distance of the end point on the Y axis
 */
const setBottomCurveDotOnLine = (
  lineEl,
  height,
  ratio = 1,
  dotX,
  lengthWithCenterDot,
  initAdjLength
) => {
  if (lineEl.points.length < 3) {
    lineEl.points.splice(1, 0, [dotX, lineEl.points[0][1] + height]);
  } else if (lineEl.points.length === 3) {
    lineEl.points[1] = [dotX, lineEl.points[0][1] + height];
  } else if (lineEl.points.length === 4) {
    // Elbow arrow
    lineEl.points[1] = [dotX, lineEl.points[0][1]];
    lineEl.points[2] = [dotX, lineEl.points[0][1] + height];
    lineEl.points[3][0] = lineEl.points[2][0] + lengthWithCenterDot;
    lineEl.points[3][1] = lineEl.points[2][1];
    return;
  } else {
    lineEl.points.splice(2, lineEl.points.length - 3);
    lineEl.points[1] = [dotX, lineEl.points[0][1] + height];
  }
  lineEl.points[2][0] = lineEl.points[1][0] + lengthWithCenterDot;
  // adjust the curvature of the second line segment
  lineEl.points[2][1] = lineEl.points[1][1] + initAdjLength * ratio * 0.8;
};

export { setTopCurveDotOnLine, setMidCurveDotOnLine, setBottomCurveDotOnLine };
