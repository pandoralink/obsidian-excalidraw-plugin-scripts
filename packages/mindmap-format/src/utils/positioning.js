const setCenter = (parent, line, gap) => {
  // Focus and gap need the api calculation of excalidraw
  // e.g. determineFocusDistance, but they are not available now
  // so they are uniformly set to 0/1
  line.startBinding.focus = 0;
  line.startBinding.gap = gap;
  line.endBinding.focus = 0;
  line.endBinding.gap = gap;
  line.x = parent.x + parent.width;
  line.y = parent.y + parent.height / 2;
};

const setTextXY = (rect, text) => {
  text.x = rect.x + (rect.width - text.width) / 2;
  text.y = rect.y + (rect.height - text.height) / 2;
};

const setChildrenXYWithElbowArrow = (parent, children, line) => {
  const x = parent.x + parent.width + line.points[3][0];
  const y = parent.y + parent.height / 2 + line.points[3][1] - children.height / 2;
  return [x, y];
}

const setChildrenXYWithArrow = (parent, children, line) => {
  const x = parent.x + parent.width + line.points[2][0];
  const y = parent.y + parent.height / 2 + line.points[2][1] - children.height / 2;
  return [x, y];
}

const setChildrenXY = (parent, children, line, elementsMap) => {
  switch (line.points.length) {
    case 4: {
      // Elbow arrow
      const [x, y] = setChildrenXYWithElbowArrow(parent, children, line);
      children.x = x;
      children.y = y;
      break;
    }
    case 3:
    default: {
      // Sharp arrow or Curved arrow
      const [x, y] = setChildrenXYWithArrow(parent, children, line);
      children.x = x;
      children.y = y;
      break;
    }
  }

  if (
    ["rectangle", "diamond", "ellipse"].includes(children.type) &&
    children.boundElements
  ) {
    const textDesc = children.boundElements.find((el) => el.type === "text");
    if (textDesc) {
      const textEl = elementsMap.get(textDesc.id);
      setTextXY(children, textEl);
    }
  }
};

export { setCenter, setTextXY, setChildrenXY };
