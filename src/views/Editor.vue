<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useGlobalStore } from '@/stores/global';

const globalStore = useGlobalStore();

const sort = ref(false);
const rechnik = computed( () => {
  return globalStore.allWords
});
const hiddenWords = computed( () => {
  return globalStore.hiddenWords;
});
const isHidden = (id) => {
  return hiddenWords.value.includes(id)
};
const tableField = [
  { field: 'srb', header: 'По-сербски' },
  { field: 'rus', header: 'По-русски' },
  { field: 'eng', header: 'Картинка' },
]

const SortRechnik = (field = "srb") => {
  rechnik.value.sort((a, b) => a[field].localeCompare(b[field]));
  if (sort.value) rechnik.value.reverse();
  sort.value = !sort.value;
}

const getData = () => {
  Promise.all([globalStore.getHiddenWords(), globalStore.getFullDictionary()]).catch(error => {
    console.error("Ошибка получения данных", error)
  })
}

const DeleteWord = async (word) => {
  globalStore.allWords = globalStore.allWords.filter(w => w.id !== word.id);
  globalStore.hiddenWords = globalStore.hiddenWords.filter(item => item !== word.id);
  const successhide = await globalStore.saveHiddenWords();
  if (!successhide?.length) console.error("Ошибка: слово не спрятано");
  const successadd = await globalStore.saveDictionary();
  if (!successadd?.length) console.error("Ошибка: словварь не записан");
}

const EditWord = async (word) => {
  globalStore.allWords = globalStore.allWords.map(w => (w.id === word.id ? word : w));
  const successadd = await globalStore.saveDictionary();
  if (!successadd?.length) console.error("Ошибка: словварь не записан");
}

const HideWord = async (id) => {
  if (globalStore.hiddenWords.includes(id)) {
    globalStore.hiddenWords = globalStore.hiddenWords.filter(item => item !== id);
  } else {
    globalStore.hiddenWords.push(id);
  }
  const successhide = await globalStore.saveHiddenWords();
  if (!successhide?.length) console.error("Ошибка: слово не спрятано");
}

onMounted(() => {
  getData();
  setTimeout(() => {
    SortRechnik("srb");
  }, 250);
});

const rowStyle = (data) => {
  if (isHidden(data.id)) {
    return { background: '#f9f9f9' };
  }
};

</script>

<template>
  <DataTable
      :value="rechnik"
      paginator
      showGridlines
      :rows="25"
      class="mt-4"
      :rowStyle="rowStyle"
      editMode="cell"
  >
    <Column v-for="column of tableField" :key="column.header" :field="column.field" :header="column.header" sortable>
      <template #body="{ data }">
        <InputText type="text" v-model="data[column.field]" size="small" class="w-full" :style="{background: isHidden(data.id) ? 'transparent' : 'white'}" />
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
        <Button @click="HideWord(data.id)" size="small" :severity="isHidden(data.id) ? 'default' : 'secondary'">
          {{ isHidden(data.id) ? "Show" : "Hide" }}
        </Button>
      </template>
    </Column>
  </DataTable>
</template>

