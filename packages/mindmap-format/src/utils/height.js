/**
 * returns the height of the upper part of all child nodes
 * and the height of the lower part of all child nodes
 * @param {Number[]} childrenTotalHeightArr
 * @returns {Number[]} [topHeight, bottomHeight]
 */
const getNodeCurrentHeight = (childrenTotalHeightArr) => {
  if (childrenTotalHeightArr.length <= 0) return [0, 0];
  else if (childrenTotalHeightArr.length === 1)
    return [childrenTotalHeightArr[0] / 2, childrenTotalHeightArr[0] / 2];
  const heightArr = childrenTotalHeightArr;
  let topHeight = 0,
    bottomHeight = 0;
  const isEven = heightArr.length % 2 === 0;
  const mid = Math.floor(heightArr.length / 2);
  const topI = mid - 1;
  const bottomI = isEven ? mid : mid + 1;
  topHeight = isEven ? 0 : heightArr[mid] / 2;
  for (let i = topI; i >= 0; i--) {
    topHeight += heightArr[i];
  }
  bottomHeight = isEven ? 0 : heightArr[mid] / 2;
  for (let i = bottomI; i < heightArr.length; i++) {
    bottomHeight += heightArr[i];
  }
  return [topHeight, bottomHeight];
};

/**
 * handle the height of each point in the single-level tree
 * @param {Array} lines
 * @param {Map} elementsMap
 * @param {Boolean} isEven
 * @param {Number} mid 'lines' array midpoint index
 * @returns {Array} height array corresponding to 'lines'
 */
const handleDotYValue = (lines, elementsMap, isEven, mid) => {
  const getTotalHeight = (line, elementsMap) => {
    return elementsMap.get(line.endBinding.elementId).totalHeight;
  };
  const getTopHeight = (line, elementsMap) => {
    return elementsMap.get(line.endBinding.elementId).topHeight;
  };
  const getBottomHeight = (line, elementsMap) => {
    return elementsMap.get(line.endBinding.elementId).bottomHeight;
  };
  const heightArr = new Array(lines.length).fill(0);
  const upI = mid === 0 ? 0 : mid - 1;
  const bottomI = isEven ? mid : mid + 1;
  let initHeight = isEven ? 0 : getTopHeight(lines[mid], elementsMap);
  for (let i = upI; i >= 0; i--) {
    heightArr[i] = initHeight + getBottomHeight(lines[i], elementsMap);
    initHeight += getTotalHeight(lines[i], elementsMap);
  }
  initHeight = isEven ? 0 : getBottomHeight(lines[mid], elementsMap);
  for (let i = bottomI; i < lines.length; i++) {
    heightArr[i] = initHeight + getTopHeight(lines[i], elementsMap);
    initHeight += getTotalHeight(lines[i], elementsMap);
  }
  return heightArr;
};

export { getNodeCurrentHeight, handleDotYValue };
