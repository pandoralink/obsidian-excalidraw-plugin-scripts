import { setCenter, setChildrenXY } from "./positioning";
import {
  setTopCurveDotOnLine,
  setMidCurveDotOnLine,
  setBottomCurveDotOnLine,
} from "./curve";
import { handleDotYValue } from "./height";

/**
 * format single-level tree
 * @param {any} parent
 * @param {Array} lines
 * @param {Map} childrenDescMap
 * @param {Map} elementsMap
 * @param {number} gap
 * @param {number} dotX
 * @param {number} lengthWithCenterDot
 * @param {number} initAdjLength
 */
const formatTree = (
  parent,
  lines,
  childrenDescMap,
  elementsMap,
  gap,
  dotX,
  lengthWithCenterDot,
  initAdjLength
) => {
  lines.forEach((item) => setCenter(parent, item, gap));

  const isEven = lines.length % 2 === 0;
  const mid = Math.floor(lines.length / 2);
  const heightArr = handleDotYValue(lines, childrenDescMap, isEven, mid);
  lines.forEach((item, index) => {
    if (isEven) {
      if (index < mid)
        setTopCurveDotOnLine(
          item,
          heightArr[index],
          index + 1,
          dotX,
          lengthWithCenterDot,
          initAdjLength
        );
      else
        setBottomCurveDotOnLine(
          item,
          heightArr[index],
          index - mid + 1,
          dotX,
          lengthWithCenterDot,
          initAdjLength
        );
    } else {
      if (index < mid)
        setTopCurveDotOnLine(
          item,
          heightArr[index],
          index + 1,
          dotX,
          lengthWithCenterDot,
          initAdjLength
        );
      else if (index === mid)
        setMidCurveDotOnLine(item, dotX, lengthWithCenterDot);
      else setBottomCurveDotOnLine(item, heightArr[index], index - mid);
    }
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

export { formatTree };
