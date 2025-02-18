import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useGlobalStore = defineStore('global', () => {

  //Метод для показа нотификации из любого места
  const showMessage = ref({ severity: 'error', summary: '', detail: '', life: 3000 });
  const setShowMessage = (severity = 'error', summary = '', detail = '', life = 3000) => {
    showMessage.value = { severity, summary, detail, life };
  };
  const showError = (err: any) => {
    err = err.toString();
    let detail = 'Неизвестная ошибка';
    if (/^4/.test(err)) detail = 'Неправильные параметры запроса';
    else if (/^5/.test(err)) detail = 'Ошибка сервера';
    showMessage.value = { severity: 'error', summary: 'Ошибка', detail: detail, life: 10000 };
  };

  return {
    setShowMessage,
    showError,
    showMessage,
  };
});
