<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useGlobalStore } from '@/stores/global';
import GrTable from "@/components/GrTable.vue";

const globalStore = useGlobalStore();
const grammar = computed( () => {
  return globalStore.grammarRules;
});

onMounted(() => {
  globalStore.getGrammar();
});
</script>

<template>
  <div class="grammar-page" v-if="grammar.padez">
    <h2 class="text-xl font-semibold mt-8 mb-3 text-center">Падежи</h2>
    <gr-table v-for="padez in ['genitiv', 'akuzativ', 'dativ', 'instrumental', 'locativ']"
      rootClass="margenta"
      :key="'padez-'+padez"
      :header="grammar.padez[padez].header"
      :data="grammar.padez[padez].data"
    />
    <h2 class="text-xl font-semibold mt-8 mb-3 text-center">Глаголы</h2>
    <div v-if="grammar && grammar.glagola">
      <gr-table v-for="form in ['pie', 'paju', 'peu']"
        :key="'glagol-'+form"
        :header="grammar.glagola[form].header"
        :data="grammar.glagola[form].data"
      />
    </div>
  </div>
</template>

