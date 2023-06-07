<template>
  <canvas ref="canvas" id="canvas" width="640" height="640" />
</template>

<script lang="ts">
import { computed, onUpdated, ref, watch } from "vue";
import * as tf from "@tensorflow/tfjs";
import { yoloColor, drawCanvas, drawModel } from "@/service/canvas";
import { defineComponent } from "vue";

export default defineComponent({
  // type inference enabled
  props: {
    myImage: {
      type: Blob,
    },
  },
  setup(props) {
    const canvas = ref<HTMLCanvasElement | null>(null);
    let model: tf.GraphModel;
    async function loadModel() {
      model = await tf.loadGraphModel("/model/model.json");
    }
    loadModel();

    const image = computed(() => props.myImage);

    watch(image, async () => {
      if (!canvas.value || !image.value) return;

      const MyCanvas = canvas.value;
      await drawCanvas(MyCanvas, image.value, model);
      await drawModel(MyCanvas, model);
    });

    return {
      canvas,
    };
  },
});
</script>

<style scoped></style>
