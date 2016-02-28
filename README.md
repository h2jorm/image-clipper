# image-clipper

Based on [ngImageEditor](https://github.com/SparrowJang/ngImageEditor)

## Command

```
npm run build
```

## Api

```
import ImageClipper from './image-clipper';

const container = document.querySelector('$image-clipper-container');
const imageSrc = 'http://url/to/image.jpg';
const imageClipper = new ImageClipper(container, imageSrc);

imageClipper.init();
```

See in demo.
