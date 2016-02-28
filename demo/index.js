var ImageClipper = require('../lib');

var $ = selector => document.querySelector(selector);

var imageClipper;

$('input').addEventListener('change', event => {
  var file = event.target.files[0];
  getImageBase64(file)
  .then(src => {
    imageClipper = new ImageClipper($('#image-clipper'), src);
    imageClipper.init([0, 0, 100, 100]);
  });
});

$('button').addEventListener('click', () => {
  var image = document.createElement('img');
  image.src = imageClipper.toDataURL();
  document.body.appendChild(image);
});

function getImageBase64(file) {
  var fr = new FileReader();
  return new Promise(resolve => {
    fr.onload = () => {
      resolve(fr.result);
    };
    fr.readAsDataURL(file);
  });
}
