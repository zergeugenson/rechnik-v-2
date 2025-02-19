import { ref } from 'vue';
import { defineStore } from 'pinia';
import { shaffle } from "@/common/functions.js";
import useFetch from '@/api/myFetsh';


export const useGlobalStore = defineStore('global', () => {

  const baseURL = !import.meta.env.DEV ? 'http://localhost:5173' : 'http://pda.hromov.com'; //window.location.origin;

  const allWords = ref<any>([]);
  const hiddenWords = ref<any>([]);
  const grammarRules = ref<any>({});
  const isLoading = ref<boolean>(false);


  async function getFullDictionary () {
    const { error, data, statusCode, onFetchError } = await useFetch(`${baseURL}/assets/data.json`, { immediate: true }).json();
    if(data?.value) {
      allWords.value = data.value;
    }
    onFetchError(() => {
      setShowMessage('error', 'Ошибка', `Код ошибки: ${statusCode.value}`, 7000);
    });
    return data.value
  }

  async function getHiddenDictionary () {
    const { error, data, statusCode, onFetchError } = await useFetch(`${baseURL}/assets/hide.json`, { immediate: true }).json();
    if(data?.value) {
      hiddenWords.value = data.value;
    }
    onFetchError(() => {
      setShowMessage('error', 'Ошибка', `Код ошибки: ${statusCode.value}`, 7000);
    });
    return data.value
  }

  async function hideWord() {
    try {
      const response = await fetch("http://pda.hromov.com/assets/hide.php", {
        method: "POST",
        body: JSON.stringify(hiddenWords.value),
        headers: { "Content-type": "application/json; charset=UTF-8" }
      });
      return await response.json();
    } catch (error) {
      console.error("Hiding error", error);
    }
  }

  async function addWord() {
    try {
      const response = await fetch("http://pda.hromov.com/assets/replace.php", {
        method: "POST",
        body: JSON.stringify(allWords.value),
        headers: { "Content-type": "application/json; charset=UTF-8" }
      });
      await response.json();
    } catch (error) {
      console.error(error);
    }
  }

  function getRechnik() {
    return allWords?.value.filter(word => {
      if (!hiddenWords.value.includes(word.id)) return word;
    });
  }

  function getShaffledRechnik() {
    return shaffle(getRechnik());
  }

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
    showMessage,
    allWords,
    hiddenWords,
    grammarRules,
    setShowMessage,
    showError,
    getShaffledRechnik,
    getFullDictionary,
    getHiddenDictionary,
    hideWord,
    addWord,
  };
});
