<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useGlobalStore } from '@/stores/global';

const globalStore = useGlobalStore();

const allWords = computed( () => {
  return globalStore.allWords
});

const rowStyle = (data) => {
  if (data.hidden) {
    return { background: '#f9f9f9' };
  }
};

const tableField = [
  { field: 'srb', header: 'По-сербски' },
  { field: 'rus', header: 'По-русски' },
  { field: 'eng', header: 'Картинка' },
];

const DeleteWord = async (word) => {
  globalStore.allWords = globalStore.allWords.filter(w => w.id !== word.id);
  const successadd = await globalStore.saveDictionary();
  if (!successadd?.length) console.error("Ошибка: словварь не записан");
}

const EditWord = async (word) => {
  globalStore.allWords = globalStore.allWords.map(w => (w.id === word.id ? word : w));
  const successadd = await globalStore.saveDictionary();
  if (!successadd?.length) console.error("Ошибка: словварь не записан");
}

const HideWord = async (id) => {
  globalStore.allWords.forEach(word => {
    if (word.id === id){
      word.hidden = !word.hidden;
    }
  })
  const successhide = await globalStore.saveDictionary();
  if (!successhide?.length) console.error("Ошибка: слово не спрятано");
}

onMounted(() => {
  globalStore.getFullDictionary()
});

</script>

<template>
  <DataTable
      :value="allWords"
      paginator
      showGridlines
      :rows="25"
      class="mt-4"
      :rowStyle="rowStyle"
      editMode="cell"
  >
    <Column v-for="column of tableField" :key="column.header" :field="column.field" :header="column.header" sortable>
      <template #body="{ data }">
        <InputText type="text" v-model="data[column.field]" size="small" class="w-full" :style="{background: data.hidden ? 'transparent' : 'white'}" />
      </template>
    </Column>
    <Column field="actions" header="Действия" style="width: 14rem !important;">
      <template #body="{ data }">
        <Button @click="DeleteWord(data)" class="mr-2 mb-1" size="small" severity="danger">
          Delete
        </Button>
        <Button @click="EditWord(data)" class="mr-2 mb-1" size="small" severity="info">
          Edit
        </Button>
        <Button @click="HideWord(data.id)" size="small" :severity="data.hidden ? 'default' : 'secondary'">
          {{ data.hidden ? "Show" : "Hide" }}
        </Button>
      </template>
    </Column>
  </DataTable>
</template>

