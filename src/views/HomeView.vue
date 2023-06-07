<template>
  <div class="mx-10 grid grid-cols-2 gap-4">
    <section class="">
      <FileUploadForm @setImage="setImage" />
    </section>
    <section class="">
      <AlterImage :myImage="myImage" />
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import * as tf from "@tensorflow/tfjs";
import FileUploadForm from "./components/FileUploadForm.vue";
import AlterImage from "./components/AlterImage.vue";

export default defineComponent({
  components: { FileUploadForm, AlterImage },
  setup() {
    let myImage = ref<Blob>();

    function setImage(file: Blob) {
      myImage.value = file;
    }

    return {
      setImage,
      myImage,
    };
  },
});
</script>

<style scoped></style>
