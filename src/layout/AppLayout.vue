<script setup lang="ts">
import { onMounted, watch, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useGlobalStore } from '@/stores/global';
import { serbianLC } from "@/common/functions.js";

const items = ref([
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

const toast = useToast();
const globalStore = useGlobalStore();
const addWord = ref();
const inputNewWord = ref( { srb: '', rus: '', eng: '' });
const userInputError = ref<boolean>(false);
const toggleAddWord = (e) =>{
  addWord.value.toggle(e);
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

onMounted(() => {
  // Promise.all(['http://localhost:5173/data.json', 'http://localhost:5173/hide.json'].map(id =>
  //     fetch(id).then(resp => resp.json())
  // )).then(resp => {
  //     console.log(resp)
  // });

});

watch(
  () => globalStore.showMessage,
  (message) => {
    toast.add(message);
  }
);
watch(
    () => addWord?.value?.visible,
    (v) => {
      globalStore.setIsAdding(v)
    }
);

</script>

<template>
  <div class="layout-wrapper flex flex-col w-full">
    <Menubar :model="items" class="app-menu-bar grow-0">
      <template #item="{ item, props }">
        <router-link v-slot="{ href, navigate }" :to="item.route" custom>
          <a v-ripple :href="href" v-bind="props.action" @click="navigate">
            <span :class="item.icon" />
            <span>{{ item.label }}</span>
          </a>
        </router-link>
      </template>
      <template #end>
        <button @click="toggleAddWord" class="p-menubar-item-link" size="small">
          <span class="pi pi-plus-circle" />
          <span>Добавить слово</span>
        </button>
      </template>
    </Menubar>

    <div class="app-body grow">
      <router-view></router-view>
    </div>

    <Toast position="bottom-right" />

    <Popover ref="addWord">
      <IftaLabel>
        <InputText class="w-full mb-2" id="srb-add-input" v-model="inputNewWord.srb" :invalid="userInputError" />
        <label for="srb-add-input">По-сербски</label>
      </IftaLabel>
      <IftaLabel>
        <InputText class="w-full mb-2" id="rus-add-input" v-model="inputNewWord.rus" :invalid="userInputError" />
        <label for="rus-add-input">По-русски</label>
      </IftaLabel>
      <IftaLabel>
        <InputText class="w-full mb-4" id="eng-add-input" v-model="inputNewWord.eng" />
        <label for="eng-add-input">Ключевая фраза для картинки</label>
      </IftaLabel>
      <Button label="Закончить" severity="secondary" @click="toggleAddWord" class="mr-2" size="small"/>
      <Button label="Сохранить" severity="success" @click="submitNewWord" size="small" />
    </Popover>
  </div>
</template>

<style lang="scss">
.app-body {
  max-height: 100%;
  overflow: hidden;
}
</style>
