<script setup>
import { watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useGlobalStore } from '@/stores/global';
const toast = useToast();
const globalStore = useGlobalStore();


setTimeout(()=>{
  globalStore.setShowMessage('error', 'Ошибка', 'Данные загрузить не удалось');
}, 2000)

watch(
  () => globalStore.showMessage,
  (message) => {
    console.log("watcher")
    toast.add(message);
  }
);

</script>

<template>
  <div class="layout-wrapper">
    <Toast position="bottom-right" />
    Здесь будет словарь
    <img src="@/assets/vue.svg" class="logo vue" alt="Vue logo" />
    <router-view></router-view>
  </div>
</template>

<style lang="scss" scoped></style>
