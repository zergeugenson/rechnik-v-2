<script setup>
import {onMounted, watch} from 'vue';
import { useToast } from 'primevue/usetoast';
import { useGlobalStore } from '@/stores/global';
const toast = useToast();
const globalStore = useGlobalStore();



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

</script>

<template>
  <div class="layout-wrapper">
    <Toast position="bottom-right" />
    <router-view></router-view>
  </div>
</template>

<style lang="scss" scoped></style>
