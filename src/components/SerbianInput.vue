// содержимое поп-апа со специальными сербскими буквами

<script setup lang="ts">
import { defineEmits } from "vue";
const emit = defineEmits(['setSrbLetter']);
</script>

<template>
    <Button
        @click="emit('setSrbLetter', letter)"
        v-for="letter in ['ђ', 'љ', 'њ', 'ћ', 'џ']"
        :key="letter"
        class="w-[2rem]"
    >
      {{letter}}
    </Button>
</template>

