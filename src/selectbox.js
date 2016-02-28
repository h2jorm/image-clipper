module.exports = class Selectbox {
  constructor(position) {
    this.position = position;

    this.movable = false;
    this.resizable = false;
    this.startEvent = null;
    this.startPosition = null;

    this.element = this.createSelectbox();
    this.change(this.position);
  }

  cancel() {
    this.movable = this.resizable = false;
    this.startEvent = this.startPosition = this.resizeDirection = null;
  }

  /**
   * @private
   */
  saveStatus(event) {
    this.startEvent = event;
    this.startPosition = this.position.slice();
  }

  /**
   * @private
   */
  createSelectbox(position) {
    const div = document.createElement('div');
    const {style} = div;
    style.position = 'absolute';
    style.cursor = 'move';
    style.border = '1px dashed #ccc';
    const anchors = ['nw', 'ne', 'se', 'sw'];
    anchors.forEach(direction => {
      div.appendChild(this.creatAncher(direction));
    });
    div.addEventListener('mousedown', event => {
      this.movable = true;
      this.saveStatus(event);
    });
    return div;
  }

  /**
   * @private
   */
  creatAncher(direction) {
    const div = document.createElement('div');
    const {style} = div;
    style.position = 'absolute';
    style.width = style.height = '8px';
    style.backgroundColor = '#ccc';
    style.cursor = `${direction}-resize`;
    switch (direction) {
    case 'nw':
      style.left = style.top = 0;
      break;
    case 'ne':
      style.right = style.top = 0;
      break;
    case 'se':
      style.right = style.bottom = 0;
      break;
    case 'sw':
      style.left = style.bottom = 0;
      break;
    }
    div.addEventListener('mousedown', event => {
      event.stopPropagation();
      this.resizable = true;
      this.resizeDirection = direction;
      this.saveStatus(event);
    });
    return div;
  }

  change(position) {
    const {style} = this.element;
    const [left, top, width, height] = position;
    style.left = `${left}px`;
    style.top = `${top}px`;
    style.width = `${width}px`;
    style.height = `${height}px`;
  }

  getCursorOffset(event) {
    const {startEvent} = this;
    if (!startEvent)
      return {offsetLeft: 0, offsetTop: 0};
    const offsetLeft = event.clientX - startEvent.clientX;
    const offsetTop = event.clientY - startEvent.clientY;
    return {offsetLeft, offsetTop};
  }
}
