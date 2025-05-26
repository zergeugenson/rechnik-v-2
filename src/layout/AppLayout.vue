<script setup lang="ts">
import { watch, ref, nextTick} from 'vue';
import { useToast } from 'primevue/usetoast';
import { useGlobalStore } from '@/stores/global';
import SerbianInput from '@/components/SerbianInput.vue';
import { serbianLC } from "@/common/functions.js";

const menuItems = ref([
  {
    label: 'Карточки',
    icon: 'pi pi-credit-card',
    route: '/'
  },
  {
    label: 'Грамматика',
    icon: 'pi pi-list-check',
    route: '/grammar'
  },
  {
    label: 'Редактор',
    icon: 'pi pi-pen-to-square',
    route: '/editor'
  },
]);

const globalStore = useGlobalStore();
const serbLetterPopOver = ref();
const addWordPopOver = ref();
const serbianInputField = ref();
const toast = useToast();
const inputNewWord = ref( { srb: '', rus: '', eng: '' });
const userInputError = ref<boolean>(false);
const cursorPosition = ref<number>();


const toggleSerbLetterPopOver = (e) => {
  serbLetterPopOver.value.hide(e);
  nextTick(() => {
    serbLetterPopOver.value.show(e);
  });
}

const setSerbLetter = (l) => {
  const elem = serbianInputField.value;
  elem.$el.focus();
  elem.d_value = elem.d_value.slice(0, cursorPosition.value) + l + elem.d_value.slice(cursorPosition.value);
  setTimeout(()=>{
    elem.$el.setSelectionRange(cursorPosition.value+1, cursorPosition.value+1);
  },10)
}

const onBlur = () => {
  cursorPosition.value = serbianInputField.value.$el.selectionStart;
}

const toggleaddWordPopOver = (e) =>{
  addWordPopOver.value.toggle(e);
}

async function submitNewWord() {
  if (!inputNewWord.value.srb || !inputNewWord.value.rus) {
    userInputError.value = true;
    return;
  }

  globalStore.allWords.push( {
    srb: serbianLC(inputNewWord.value.srb),
    rus: inputNewWord.value.rus,
    eng: inputNewWord.value.eng,
    id: Date.now()
  });

  const success = await globalStore.saveDictionary();
  if (success?.length) {
    inputNewWord.value = { srb: "", rus: "", eng: "" };
    userInputError.value = false;
  } else {
    console.error("Ошибка записи словаря");
  }
}

watch(
  () => globalStore.showMessage,
  (message) => {
    toast.add(message);
  }
);
watch(
    () => addWordPopOver?.value?.visible,
    (n) => {
      globalStore.setIsAdding(n)
    }
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
        <button @click="toggleaddWordPopOver" class="p-menubar-item-link" size="small">
          <span class="pi pi-plus-circle" />
          <span>Добавить слово</span>
        </button>
      </template>
    </Menubar>

    <div class="grow max-h-full overflow-hidden">
      <router-view></router-view>
    </div>

    <Toast position="bottom-right" />

    <Popover ref="addWordPopOver">
      <IftaLabel>
        <InputText
            v-model="inputNewWord.srb"
            :invalid="userInputError"
            @click="toggleSerbLetterPopOver"
            @blur="onBlur"
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
            :invalid="userInputError"
            class="w-full mb-2"
            id="rus-add-input"
            autocomplete="off"
        />
        <label for="rus-add-input">По-русски</label>
      </IftaLabel>
      <IftaLabel>
        <InputText v-model="inputNewWord.eng" class="w-full mb-4" id="eng-add-input" autocomplete="off"/>
        <label for="eng-add-input">Ключевая фраза для картинки</label>
      </IftaLabel>
      <Button label="Закончить" severity="secondary" @click="toggleaddWordPopOver" class="mr-2" size="small" />
      <Button label="Сохранить" severity="success" @click="submitNewWord" size="small" />
    </Popover>

    <Popover ref="serbLetterPopOver">
      <div class="flex flex-row gap-3">
        <serbian-input @set-srb-letter="setSerbLetter" />
      </div>
    </Popover>

  </div>
</template>

