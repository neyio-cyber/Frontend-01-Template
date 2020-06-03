const match = (selector) => (element) => {
  if (!selector) {
    return false;
  }
  if (!element.attributes) {
    return false;
  }
  if (selector && selector[0] === "#") {
    const index = element.attributes.findIndex((attr) => attr.name === "id");
    if (!~index) {
      return false;
    }
    const attr = element.attributes[index];
    if (attr && attr.value === [...selector].slice(1).join("")) {
      return true;
    }
  } else if (selector.charAt(0) === ".") {
    const index = element.attributes.findIndex((attr) => attr.name === "class");
    if (!~index) {
      return false;
    }
    const attr = element.attributes[index];
    const flag =
      attr &&
      attr.value
        .split(/\s+/)
        .some((className) => className === [...selector].slice(1).join(""));
    if (flag) {
      return true;
    }
  } else {
    if (element.tagName === selector) {
      return true;
    }
  }
  return false;
};

match("div #id.class", document.getElementById("id"));
