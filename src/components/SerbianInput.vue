<script setup lang="ts">
import { defineEmits } from "vue";
const emit = defineEmits(['setSrbLetter']);
const putLetter = letter => {
  emit('setSrbLetter', letter);
}
</script>

<template>
  <Button @click="putLetter('ђ')">ђ</Button>
</template>

<style scoped lang="scss">

</style>
