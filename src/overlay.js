const Selectbox = require('./selectbox');

module.exports = class Overlay {
  constructor(imageSrc) {
    this.element = document.createElement('canvas');
    this.ctx = this.element.getContext('2d');
    this.scale = 1;
    this.imagePromise = createImage(imageSrc).then(image => {
      this.image = image;
      this.refreshAndRender();
    });
  }

  renderSelected(selected) {
    this.refreshAndRender();
    const destination = selected.slice();
    const source = selected.slice().map(item => item / this.scale);
    this.ctx.drawImage(this.image, ...source.concat(destination));
  }

  /**
   * @private
   */
  refreshAndRender() {
    this.refresh();
    this.clear();
    this.render();
  }

  /**
   * @private
   */
  refresh() {
    const {width, height} = this.image;
    const {element} = this;
    const {clientWidth: parentClientWidth} = element.parentNode;
    if (width <= parentClientWidth) {
      element.width = width;
      element.height = height;
      this.scale = 1;
      return;
    }
    const rate = width / height;
    element.width = parentClientWidth;
    element.height = parentClientWidth / rate;
    this.scale = parentClientWidth / width;
  }

  /**
   * @private
   */
  clear() {
    const {width, height} = this.element;
    this.ctx.clearRect(0, 0, width, height);
  }

  /**
   * @private
   */
  render() {
    const {ctx, element} = this;
    const {width: cvsWidth, height: cvsHeight} = element;
    const {width: imgWidth, height: imgHeight} = this.image;
    // step 1: draw the original image
    ctx.drawImage(this.image, 0, 0, imgWidth, imgHeight, 0, 0, cvsWidth, cvsHeight);
    // step 2: fade the image
    this.converterToGray();
  }

  /**
   * @private
   */
  converterToGray() {
    const {element: canvas, ctx} = this;
    var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imgData.data;
    var dataSize = data.length;

    for (var i = 0; i < dataSize; i = i + 4) {
      var r = data[i];
      var g = data[i + 1];
      var b = data[i + 2];
      var brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];

      data[i] = brightness;
      data[i + 1] = brightness;
      data[i + 2] = brightness;
    }
    ctx.putImageData(imgData, 0, 0);
  }
};


function createImage(src) {
  return new Promise(resolve => {
    var image = new Image();
    image.crossOrigin = 'Anonymous';
    image.onload = function () {
      resolve(image);
    };
    image.src = src;
  });
}
