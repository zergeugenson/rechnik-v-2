<script setup lang="ts">
import { computed, onMounted, ref, nextTick } from 'vue';
import { useGlobalStore } from '@/stores/global';
import SerbianInput from '@/components/SerbianInput.vue';
import type { Dictionary } from '@/interfaces/interfaces';

const tableField = [
  { field: 'srb', header: 'По-сербски' },
  { field: 'rus', header: 'По-русски' },
  { field: 'eng', header: 'Картинка' },
];
const globalStore = useGlobalStore();
const currentInputField = ref<string>();
const cursorPosition = ref<number>();
const serbLetterPopOver = ref();
const elementRefs:{ [key: string]: any } = {};
const allWords = computed<Dictionary[]>( () => {
  return globalStore.allWords
});

const setFieldRefs = (el:HTMLElement, id:string, model: any) => {
  if (el && id) {
    elementRefs[id] = {element: el, data: model};
  }
};

const toggleSerbLetterPopOver = (name:string, e:Event) => {
  serbLetterPopOver.value.hide(e);
  if(name !== 'srb') return;
  nextTick(() => {
    serbLetterPopOver.value.show(e);
  });
}
const onBlur = (value:string) => {
  currentInputField.value = value;
  cursorPosition.value = elementRefs[value].element.$el.selectionStart;
}
const setSerbLetter = (letter:string) => {
  const elem = elementRefs[currentInputField.value].element
  elem.$el.focus()
  elem.d_value = elem.d_value.slice(0, cursorPosition.value) + letter + elem.d_value.slice(cursorPosition.value);
  setTimeout(()=>{
    elem.$el.setSelectionRange(cursorPosition.value+1, cursorPosition.value+1);
  },10)
}

const rowStyle = (data) => {
  if (data.hidden) {
    return { background: '#f9f9f9' };
  }
};

const DeleteWord = async (word) => {
  globalStore.allWords = globalStore.allWords.filter(w => w.id !== word.id);
  const successadd = await globalStore.saveDictionary();
  if (!successadd?.length) console.error("Ошибка: словварь не записан");
}

const EditWord = async (word:Dictionary) => {
  globalStore.allWords = globalStore.allWords.map((w:Dictionary) => (w.id === word.id ? word : w));
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
  >
    <Column v-for="column of tableField" :key="column.header" :field="column.field" :header="column.header" sortable>
      <template #body="{ data, index }">
        <InputText
            type="text"
            v-model="data[column.field]"
            size="small"
            class="w-full"
            :style="{background: data.hidden ? 'transparent' : 'white'}"
            @click="event => toggleSerbLetterPopOver(column.field, event)"
            :ref="(el) => setFieldRefs(el, column.field+index, data[column.field])"
            @blur="e => { onBlur(column.field+index); data[column.field] = e.target.value; }"
        />
      </template>
    </Column>
    <Column field="actions" header="Действия" class="w-[14rem]">
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

  <Popover ref="serbLetterPopOver">
    <div class="flex flex-row gap-3">
      <serbian-input @set-srb-letter="setSerbLetter" @close="serbLetterPopOver.hide();" />
    </div>
  </Popover>
</template>

