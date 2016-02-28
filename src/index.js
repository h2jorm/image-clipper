const Overlay = require('./overlay');
const Selectbox = require('./selectbox');

module.exports = class ImageClipper {
  constructor(container, imageSrc) {
    this.container = container;
    this.overlay = new Overlay(imageSrc);
    this.element = createImageClipper(this.overlay.element);
    container.appendChild(this.element);
  }

  init(selected) {
    this.selected = selected;
    this.selectbox = new Selectbox(selected);

    const {overlay, selectbox} = this;
    this.element.appendChild(selectbox.element);
    overlay.imagePromise.then(() => overlay.renderSelected(selected));

    this.element.addEventListener('mouseup', event => {
      selectbox.cancel();
    });

    this.element.addEventListener('mousemove', event => {
      if (!selectbox.movable && !selectbox.resizable)
        return;
      const {offsetLeft, offsetTop} = selectbox.getCursorOffset(event);
      const [left, top, width, height] = selectbox.startPosition;
      if (selectbox.movable) {
        selected[0] = left + offsetLeft;
        selected[1] = top + offsetTop;
      }
      if (selectbox.resizable) {
        switch (selectbox.resizeDirection) {
        case 'nw':
          selected[0] = left + offsetLeft;
          selected[1] = top + offsetTop;
          selected[2] = width - offsetLeft;
          selected[3] = height - offsetTop;
          break;
        case 'ne':
          selected[0] = left;
          selected[1] = top + offsetTop;
          selected[2] = width + offsetLeft;
          selected[3] = height - offsetTop;
          break;
        case 'se':
          selected[2] = width + offsetLeft;
          selected[3] = height + offsetTop;
          break;
        case 'sw':
          selected[0] = left + offsetLeft;
          selected[1] = top;
          selected[2] = width - offsetLeft;
          selected[3] = height + offsetTop;
          break;
        }
      }
      this.sanitizeSelected();
      selectbox.change(selected);
      overlay.renderSelected(selected);
    });
  }

  /**
   * @private
   */
  sanitizeSelected() {
    const {overlay, selected} = this;
    const [left, top, width, height] = selected;
    const {width: maxWidth, height: maxHeight} = overlay.element;
    if (width > maxWidth)
      selected[2] = maxWidth;
    if (height > maxHeight)
      selected[3] = maxHeight;
    const maxLeft = maxWidth - selected[2];
    const maxTop = maxHeight - selected[3];
    if (left < 0)
      selected[0] = 0;
    if (left > maxLeft)
      selected[0] = maxLeft;
    if (top < 0)
      selected[1] = 0;
    if (top > maxTop)
      selected[1] = maxTop;
  }

  /**
   * @param {String} type
   * @param {Object} selected
   * @return String
   */
  toDataURL(type) {
    const {overlay: {element: canvas}, selected} = this;
    const copyCanvas = document.createElement('canvas');
    const ctx = copyCanvas.getContext('2d');

    const [left, top, width, height] = selected;
    copyCanvas.width = width;
    copyCanvas.height = height;
    ctx.drawImage(canvas, left, top, width, height, 0, 0, width, height);

    return copyCanvas.toDataURL(type);
  }
};

function createImageClipper(canvas) {
  var div = document.createElement('div');
  div.style.position = 'relative';
  div.appendChild(canvas);
  return div;
}
