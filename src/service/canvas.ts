import * as tf from "@tensorflow/tfjs";
const names = [
  "person",
  "bicycle",
  "car",
  "motorcycle",
  "airplane",
  "bus",
  "train",
  "truck",
  "boat",
  "traffic light",
  "fire hydrant",
  "stop sign",
  "parking meter",
  "bench",
  "bird",
  "cat",
  "dog",
  "horse",
  "sheep",
  "cow",
  "elephant",
  "bear",
  "zebra",
  "giraffe",
  "backpack",
  "umbrella",
  "handbag",
  "tie",
  "suitcase",
  "frisbee",
  "skis",
  "snowboard",
  "sports ball",
  "kite",
  "baseball bat",
  "baseball glove",
  "skateboard",
  "surfboard",
  "tennis racket",
  "bottle",
  "wine glass",
  "cup",
  "fork",
  "knife",
  "spoon",
  "bowl",
  "banana",
  "apple",
  "sandwich",
  "orange",
  "broccoli",
  "carrot",
  "hot dog",
  "pizza",
  "donut",
  "cake",
  "chair",
  "couch",
  "potted plant",
  "bed",
  "dining table",
  "toilet",
  "tv",
  "laptop",
  "mouse",
  "remote",
  "keyboard",
  "cell phone",
  "microwave",
  "oven",
  "toaster",
  "sink",
  "refrigerator",
  "book",
  "clock",
  "vase",
  "scissors",
  "teddy bear",
  "hair drier",
  "toothbrush",
];
export const yoloColor: string[] = [];

for (let i = 0; i < 100; i++) {
  while (true) {
    /*eslint no-constant-condition: ["error", { "checkLoops": false }]*/
    const r = parseInt((Math.random() * 255).toString());
    const g = parseInt((Math.random() * 255).toString());
    const b = parseInt((Math.random() * 255).toString());
    const candidate = `rgba(${r}, ${g}, ${b})`;
    if (!yoloColor.includes(candidate)) {
      // yoloColor.push(candidate);
      yoloColor.push("green");
      break;
    }
  }
}

export const drawCanvas = (
  canvas: HTMLCanvasElement,
  image: Blob,
  model: tf.GraphModel
): Promise<void> => {
  return new Promise((res, rej) => {
    const context = canvas.getContext("2d");
    const imageURL = URL.createObjectURL(image);
    if (!context) return rej();

    const newImage = new Image();
    newImage.src = imageURL;
    newImage.onload = function () {
      const naturalWidth = newImage.naturalWidth;
      const naturalHeight = newImage.naturalHeight;
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      context.fillStyle = "#000000";
      context.fillRect(0, 0, canvas.width, canvas.height);
      const ratio = Math.min(
        canvas.width / newImage.naturalWidth,
        canvas.height / newImage.naturalHeight
      );
      const newWidth = Math.round(naturalWidth * ratio);
      const newHeight = Math.round(naturalHeight * ratio);
      context.drawImage(
        newImage,
        0,
        0,
        naturalWidth,
        naturalHeight,
        (canvas.width - newWidth) / 2,
        (canvas.height - newHeight) / 2,
        newWidth,
        newHeight
      );
      res();
    };
  });
};

export const drawModel = (
  canvas: HTMLCanvasElement,
  model: tf.GraphModel
): Promise<void> => {
  return new Promise((response, rej) => {
    const context = canvas.getContext("2d");
    if (!context) return rej();
    console.log(canvas);
    const modelInput = tf.tidy(() => {
      return tf.image
        .resizeBilinear(tf.browser.fromPixels(canvas), [640, 640])
        .div(255.0)
        .expandDims(0);
    });

    model
      .executeAsync(modelInput)
      .then((res) => {
        // Font options.
        if (!Array.isArray(res)) return;
        const font = "16px sans-serif";
        context.font = font;
        context.textBaseline = "top";

        const [boxes, scores, classes, valid_detections] = res;
        const boxes_data = boxes.dataSync();
        const scores_data = scores.dataSync();
        const classes_data = classes.dataSync();
        const valid_detections_data = valid_detections.dataSync()[0];
        tf.dispose(res);

        for (let i = 0; i < valid_detections_data; ++i) {
          let [x1, y1, x2, y2] = boxes_data.slice(i * 4, (i + 1) * 4);
          x1 *= canvas.width;
          x2 *= canvas.width;
          y1 *= canvas.height;
          y2 *= canvas.height;
          const width = x2 - x1;
          const height = y2 - y1;
          const klass = names[classes_data[i]];
          const score = scores_data[i].toFixed(2);

          context.strokeStyle = yoloColor[classes_data[i]];
          context.lineWidth = 4;
          context.strokeRect(x1, y1, width, height);

          context.fillStyle = yoloColor[classes_data[i]];
          const textWidth = context.measureText(klass + ":" + score).width;
          const textHeight = parseInt(font, 10); // base 10
          context.fillRect(x1, y1, textWidth + 4, textHeight + 4);
        }

        for (let i = 0; i < valid_detections_data; ++i) {
          let [x1, y1, ,] = boxes_data.slice(i * 4, (i + 1) * 4);
          x1 *= canvas.width;
          y1 *= canvas.height;
          const klass = names[classes_data[i]];
          const score = scores_data[i].toFixed(2);

          context.fillStyle = "white";
          context.fillText(klass + ":" + score, x1, y1);
        }
        return response();
      })
      .catch((err) => {
        console.log(err);
        rej();
      });
  });
};
