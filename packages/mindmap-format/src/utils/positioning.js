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

const setChildrenXY = (parent, children, line, elementsMap) => {
  children.x = parent.x + parent.width + line.points[2][0];
  children.y =
    parent.y + parent.height / 2 + line.points[2][1] - children.height / 2;
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
