<template>
  <div class="flex justify-center">
    <div
      class="img_box"
      :style="
        !isImge
          ? 'border: dashed 1px black; '
          : 'border: none; flex: 0.1 0 40%;'
      "
      @drop.prevent="DropDownImage"
      @dragover.prevent
    >
      <label
        class="label"
        className="input-file-button"
        for="input-img"
        style="cursor: pointer"
      >
        <p v-if="!isImge" class="drag">Choose or Drag img file here</p>
      </label>
      <canvas
        ref="canvas"
        v-show="isImge"
        id="canvas"
        width="640"
        height="640"
      />
    </div>
    <input
      type="file"
      id="input-img"
      @change="InputImage"
      style="display: none"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  emits: ["setImage"],
  setup(props, { emit }) {
    const isImge = ref(false);

    function DropDownImage(event: DragEvent) {
      const { dataTransfer } = event;
      if (dataTransfer) {
        emit("setImage", dataTransfer.files[0]);
      }
    }

    function InputImage(event: Event) {
      const target = event.target as HTMLInputElement;
      if (target.files) {
        emit("setImage", target.files[0]);
      }
    }

    return { isImge, DropDownImage, InputImage };
  },
});
</script>

<style scoped>
.img_box {
  width: 640px;
  height: 640px;
}

.drag {
  width: 640px;
  height: 640px;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bolder;
  font-size: 1.4em;
}
</style>
