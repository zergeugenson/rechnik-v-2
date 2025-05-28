<script setup lang="ts">
import { watch, ref, nextTick } from "vue";
import { useToast } from "primevue/usetoast";
import { useGlobalStore } from "@/stores/global";
import SerbianInput from "@/components/SerbianInput.vue";
import { serbianLC } from "@/common/functions.js";
import { required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";

const menuItems = ref([
  {
    label: "Карточки",
    icon: "pi pi-credit-card",
    route: "/",
  },
  {
    label: "Грамматика",
    icon: "pi pi-list-check",
    route: "/grammar",
  },
  {
    label: "Редактор",
    icon: "pi pi-pen-to-square",
    route: "/editor",
  },
]);

const addWordRules = {
  srb: { required },
  rus: { required },
};

const inputNewWord = ref({ srb: "", rus: "", eng: "" });
const globalStore = useGlobalStore();
const serbLetterPopOver = ref();
const addWordPopOver = ref();
const serbianInputField = ref();
const toast = useToast();

const cursorPosition = ref<number>();
const addWordValidate: any = useVuelidate(addWordRules, inputNewWord);

const toggleSerbLetterPopOver = (e) => {
  serbLetterPopOver.value.hide(e);
  nextTick(() => {
    serbLetterPopOver.value.show(e);
  });
};

const setSerbLetter = (l) => {
  const elem = serbianInputField.value;
  elem.$el.focus();
  elem.d_value =
    elem.d_value.slice(0, cursorPosition.value) +
    l +
    elem.d_value.slice(cursorPosition.value);
  setTimeout(() => {
    elem.$el.setSelectionRange(
      cursorPosition.value + 1,
      cursorPosition.value + 1,
    );
  }, 10);
};

const onBlur = () => {
  cursorPosition.value = serbianInputField.value.$el.selectionStart;
};

const toggleaddWordPopOver = (e) => {
  addWordValidate.value.$reset();
  inputNewWord.value = { srb: "", rus: "", eng: "" };
  addWordPopOver.value.toggle(e);
};

async function submitNewWord() {
  await addWordValidate.value.$validate();
  if (!addWordValidate.value.$invalid) {
    globalStore.allWords.push({
      srb: serbianLC(inputNewWord.value.srb),
      rus: inputNewWord.value.rus,
      eng: inputNewWord.value.eng,
      id: Date.now(),
    });
    const success = await globalStore.saveDictionary();
    toggleaddWordPopOver("");
    if (!success?.length) {
      console.error("Ошибка записи словаря");
    }
  }
}

watch(
  () => globalStore.showMessage,
  (message) => {
    toast.add(message);
  },
);
watch(
  () => addWordPopOver?.value?.visible,
  (n) => {
    globalStore.setIsAdding(n);
  },
);
</script>

<template>
  <div class="layout-wrapper flex flex-col w-full">
    <Menubar :model="menuItems" class="app-menu-bar grow-0">
      <template #item="{ item, props }">
        <router-link v-slot="{ href, navigate }" :to="item.route" custom>
          <a v-ripple :href="href" v-bind="props.action" @click="navigate">
            <span :class="item.icon" />
            <span>{{ item.label }}</span>
          </a>
        </router-link>
      </template>
      <template #end>
        <button
          @click="toggleaddWordPopOver"
          class="p-menubar-item-link"
          size="small"
        >
          <span class="pi pi-plus-circle" />
          <span>Добавить слово</span>
        </button>
      </template>
    </Menubar>

    <div class="grow max-h-full overflow-hidden">
      <router-view></router-view>
    </div>

    <Toast position="bottom-right" />

    <Popover ref="addWordPopOver" position="top" placeholder="Top">
      <IftaLabel>
        <InputText
          v-model="inputNewWord.srb"
          :invalid="addWordValidate.srb.$error"
          @click="toggleSerbLetterPopOver"
          @blur="
            (e) => {
              onBlur();
              inputNewWord.srb = e.target.value;
            }
          "
          class="w-full mb-2"
          id="srb-add-input"
          ref="serbianInputField"
          autocomplete="off"
        />
        <label for="srb-add-input">По-сербски</label>
      </IftaLabel>
      <IftaLabel>
        <InputText
          v-model="inputNewWord.rus"
          :invalid="addWordValidate.rus.$error"
          class="w-full mb-2"
          id="rus-add-input"
          autocomplete="off"
        />
        <label for="rus-add-input">По-русски</label>
      </IftaLabel>
      <IftaLabel>
        <InputText
          v-model="inputNewWord.eng"
          class="w-full mb-4"
          id="eng-add-input"
          autocomplete="off"
        />
        <label for="eng-add-input">Ключевая фраза для картинки</label>
      </IftaLabel>
      <Button
        label="Закончить"
        severity="secondary"
        @click="toggleaddWordPopOver"
        class="mr-2"
        size="small"
      />
      <Button
        label="Сохранить"
        severity="success"
        @click="submitNewWord"
        size="small"
      />
    </Popover>

    <Popover ref="serbLetterPopOver">
      <div class="flex flex-row gap-3">
        <serbian-input
          @set-srb-letter="setSerbLetter"
          @close="serbLetterPopOver.hide()"
          show-close-button
        />
      </div>
    </Popover>
  </div>
</template>
