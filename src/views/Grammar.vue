<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useGlobalStore } from "@/stores/global";
import GrTable from "@/components/GrTable.vue";
import type { Grammar } from "@/interfaces/interfaces";

const globalStore = useGlobalStore();
const grammar: Grammar = computed(() => {
  return globalStore.grammarRules;
});

onMounted(() => {
  globalStore.getGrammar();
});
</script>

<template>
  <div class="grammar-page" v-if="grammar.padez">
    <h2 class="text-xl font-semibold mt-8 mb-3 text-center">Падежи</h2>
    <gr-table
      v-for="currentPadez in Object.values(grammar.padez)"
      rootClass="margenta"
      :key="'padez-' + currentPadez.header"
      :header="currentPadez.header"
      :data="currentPadez.data"
    />
    <h2 class="text-xl font-semibold mt-8 mb-3 text-center">Глаголы</h2>
    <div v-if="grammar && grammar.glagola">
      <gr-table
        v-for="glagolForm in Object.values(grammar.glagola)"
        :key="'glagol-' + glagolForm.header"
        :header="glagolForm.header"
        :data="glagolForm.data"
      />
    </div>
  </div>
</template>
