// содержимое поп-апа со специальными сербскими буквами

<script setup lang="ts">
import { defineEmits, defineProps } from "vue";

const emit = defineEmits(["setSrbLetter", "close"]);
defineProps({
  showCloseButton: { type: Boolean, default: true },
});
</script>

<template>
  <Button
    v-if="showCloseButton"
    @click="emit('close')"
    icon="pi pi-times"
    severity="secondary"
    class="helper__close-button"
    rounded
  />
  <Button
    @click="emit('setSrbLetter', letter)"
    v-for="letter in ['ђ', 'љ', 'њ', 'ћ', 'џ']"
    :key="letter"
    class="w-[2rem]"
  >
    {{ letter }}
  </Button>
</template>

<style lang="scss" scoped>
.helper__close-button {
  position: absolute !important;
  right: -10px;
  top: -10px;
  z-index: 1;
  font-size: 0.75rem;
  height: 25px !important;
  width: 25px !important;
  border: 1px solid rgb(203, 213, 225);
  :deep(.pi) {
    font-size: 0.75rem !important;
  }
}
</style>
