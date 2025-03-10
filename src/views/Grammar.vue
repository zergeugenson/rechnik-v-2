<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useGlobalStore } from '@/stores/global';
import GrTable from "@/components/GrTable.vue";
import { useRouter } from "vue-router";

const globalStore = useGlobalStore();
const $router = useRouter();
const grammar = computed( () => {
  return globalStore.grammarRules;
});

onMounted(() => {
  globalStore.getGrammar();
});
</script>

<template>
  <div class="grammar-page" v-if="grammar.padez">
    <button class="small-button cards" @click="$router.push('/')" size="small">
      cards
    </button>
    <h2>Падежи</h2>
    <gr-table
      rootClass="margenta"
      :header="grammar.padez.genitiv.header"
      :data="grammar.padez.genitiv.data"
    />
    <gr-table
      rootClass="margenta"
      :header="grammar.padez.akuzativ.header"
      :data="grammar.padez.akuzativ.data"
    />
    <gr-table
      rootClass="margenta"
      :header="grammar.padez.dativ.header"
      :data="grammar.padez.dativ.data"
    />
    <gr-table
      rootClass="margenta"
      :header="grammar.padez.instrumental.header"
      :data="grammar.padez.instrumental.data"
    />
    <gr-table
      rootClass="margenta"
      :header="grammar.padez.locativ.header"
      :data="grammar.padez.locativ.data"
    />
    <h2>Глаголы</h2>
    <div v-if="grammar && grammar.glagola">
      <gr-table
        :header="grammar.glagola.pie.header"
        :data="grammar.glagola.pie.data"
      />
      <gr-table
        :header="grammar.glagola.paju.header"
        :data="grammar.glagola.paju.data"
      />
      <gr-table
        :header="grammar.glagola.peu.header"
        :data="grammar.glagola.peu.data"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
$font-size: 1rem;
$background-color: white;
$font-color: #dae0e0;
$page-width: auto;
$grey: #605E5A;
$danger-button: red;
$red: #dd2234;
$green: #28a745;
$milky: #dbdbdb;
$white: #ffffff;
$yellow: #feb300;
$blue: #0366ee;
$margenta: #4713AFFF;
.grammar-page {
  position: relative;
  padding: 15px;
  max-width: 640px;
  margin: auto;
  min-height: 500px;
  .gr-table {
    margin-bottom: 30px;
  }
}
</style>
