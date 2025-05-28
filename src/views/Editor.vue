<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useGlobalStore } from "@/stores/global";
import SerbianInput from "@/components/SerbianInput.vue";
import type { Dictionary } from "@/interfaces/interfaces";
import { FilterMatchMode } from "@primevue/core/api";

const tableField = [
  { field: "srb", header: "По-сербски" },
  { field: "rus", header: "По-русски" },
  { field: "eng", header: "Картинка" },
];
const wordFilters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const globalStore = useGlobalStore();
const currentInputField = ref<string>();
const cursorPosition = ref<number>();
const serbLetterPopOver = ref();
const backupWordForCancelEditMobile = ref<Dictionary>({}); // На мобилах отсутствует кнопка 'Escape' и нельзя отменить редактирование ячейки
const elementRefs: { [key: string]: any } = {};
const allWords = computed<Dictionary[]>(() => {
  return globalStore.allWords;
});

const setFieldRefs = (el: HTMLElement, id: string, model: any) => {
  if (el && id) {
    elementRefs[id] = { element: el, data: model };
  }
};

const toggleSerbLetterPopOver = (name: string, e: Event) => {
  if (name !== "srb") return;
  serbLetterPopOver.value.show(e);
};
const onBlur = (value: string) => {
  currentInputField.value = value;
  cursorPosition.value = elementRefs[value].element.$el.selectionStart;
};
const setSerbLetter = (letter: string) => {
  const elem = elementRefs[currentInputField.value].element;
  elem.$el.focus();
  elem.d_value =
    elem.d_value.slice(0, cursorPosition.value) +
    letter +
    elem.d_value.slice(cursorPosition.value);
  setTimeout(() => {
    elem.$el.setSelectionRange(
      cursorPosition.value + 1,
      cursorPosition.value + 1,
    );
  }, 10);
};

const rowStyle = (data) => {
  if (data.hidden) {
    return { background: "#f9f9f9" };
  }
};

const onCellEditComplete = (event) => {
  serbLetterPopOver.value.hide(event);
  let { data, newValue, field } = event;
  if (event.value !== event.newValue) {
    data[field] = newValue;
    EditWord(data);
  }
};

const backupCellEditWord = (event) => {
  backupWordForCancelEditMobile.value = event.data;
};

const DeleteWord = async (word) => {
  globalStore.allWords = globalStore.allWords.filter((w) => w.id !== word.id);
  const successadd = await globalStore.saveDictionary();
  if (!successadd?.length) console.error("Ошибка: словварь не записан");
};

const EditWord = async (word: Dictionary) => {
  globalStore.allWords = globalStore.allWords.map((w: Dictionary) =>
    w.id === word.id ? word : w,
  );
  const successadd = await globalStore.saveDictionary();
  if (!successadd?.length) console.error("Ошибка: словварь не записан");
};

const HideWord = async (id) => {
  globalStore.allWords.forEach((word) => {
    if (word.id === id) {
      word.hidden = !word.hidden;
    }
  });
  const successhide = await globalStore.saveDictionary();
  if (!successhide?.length) console.error("Ошибка: слово не спрятано");
};

onMounted(() => {
  globalStore.getFullDictionary();
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
    v-model:filters="wordFilters"
    :globalFilterFields="['srb', 'rus']"
    editMode="cell"
    @cell-edit-complete="onCellEditComplete"
    @cell-edit-init="backupCellEditWord"
  >
    <template #header>
      <IconField>
        <InputIcon>
          <i class="pi pi-search" />
        </InputIcon>
        <InputText
          v-model="wordFilters['global'].value"
          placeholder="Global Search"
        />
      </IconField>
    </template>
    <Column
      v-for="column of tableField"
      :key="column.header"
      :field="column.field"
      :header="column.header"
      sortable
    >
      <template #body="{ data }">
        {{ data[column.field] }}
      </template>
      <template #editor="{ data, field }">
        <div class="relative">
          <InputText
            v-model="data[field]"
            autofocus
            fluid
            :style="{
              background: data.hidden ? 'transparent' : 'white',
              'padding-right': '2.5rem',
            }"
            @focus="(event) => toggleSerbLetterPopOver(column.field, event)"
            :ref="(el) => setFieldRefs(el, column.field, data[column.field])"
            @blur="
              (e) => {
                onBlur(column.field);
                data[column.field] = e.target.value;
              }
            "
          />
          <Button
            @click="data[field] = backupWordForCancelEditMobile[field]"
            icon="pi pi-times"
            severity="secondary"
            rounded
            aria-label="Cancel"
            class="edit-cancel-button"
          />
        </div>
      </template>
    </Column>
    <Column field="actions" header="Действия" class="w-[11rem]">
      <template #body="{ data }">
        <Button
          @click="DeleteWord(data)"
          class="mr-2 mb-1"
          size="small"
          severity="danger"
        >
          Delete
        </Button>
        <Button
          @click="HideWord(data.id)"
          size="small"
          :severity="data.hidden ? 'default' : 'secondary'"
        >
          {{ data.hidden ? "Show" : "Hide" }}
        </Button>
      </template>
    </Column>
  </DataTable>

  <Popover ref="serbLetterPopOver">
    <div class="flex flex-row gap-3">
      <serbian-input
        @set-srb-letter="setSerbLetter"
        @close="serbLetterPopOver.hide()"
      />
    </div>
  </Popover>
</template>

<style lang="scss" scoped>
.edit-cancel-button {
  position: absolute !important;
  right: 0.5rem;
  top: 0.5rem;
  z-index: 1;
  font-size: 0.75rem;
  height: 25px !important;
  width: 25px !important;
  border: 1px solid rgb(203, 213, 225);
  :deep(.pi) {
    font-size: 0.75rem !important;
  }
  @include fdesk {
    display: none;
  }
}
</style>
