import { ref } from 'vue';
import { defineStore } from 'pinia';
import { shaffleArray } from "@/common/functions.js";
import useFetch from '@/api/myFetsh';

export const baseURL = !import.meta.env.DEV ? 'http://localhost:5173' : 'http://pda.hromov.com/assets'; //window.location.origin;

export const useGlobalStore = defineStore('global', () => {

  // Store
  const allWords = ref<any>([]);
  const hiddenWords = ref<any>([]);
  const grammarRules = ref<any>({});
  const isAdding = ref<boolean>(false);

  // Actions
  async function getFullDictionary () {
    const { data, statusCode } = await useFetch(`${baseURL}/data.json`, { immediate: true }).get().json();
    if(data?.value) {
      allWords.value = data.value;
    } else {
      setShowMessage('error', 'Ошибка получения словаря', `Код ошибки: ${statusCode.value}`, 7000);
    }
    return data.value
  }

  async function getHiddenDictionary () {
    const { data, statusCode } = await useFetch(`${baseURL}/hide.json`, { immediate: true }).get().json();
    if(data?.value) {
      hiddenWords.value = data.value;
    } else {
      setShowMessage('error', 'Ошибка получения спрятанных слов', `Код ошибки: ${statusCode.value}`, 7000);
    }
    return data.value || []
  }

  async function getGrammar () {
    const { data, statusCode } = await useFetch(`${baseURL}/grammar.json`, { immediate: true }).get().json();
    if(data?.value) {
      grammarRules.value = data.value;
    }else {
      setShowMessage('error', 'Ошибка файла грамматики', `Код ошибки: ${statusCode.value}`, 7000);
    }
    return data.value || []
  }

  async function hideWord() {
    const { data, statusCode } = await useFetch(`${baseURL}/hides.php`, { immediate: true, headers: { "Content-type": "application/json; charset=UTF-8" } }).post(JSON.stringify(hiddenWords.value)).json();
    if(!data?.value) {
      setShowMessage('error', 'В демке запись выключена', `Код ошибки: ${statusCode.value}`, 7000);
    }
    return data.value || []
  }

  async function addWord() {
    const { data, statusCode } = await useFetch(`${baseURL}/replace.php`, { immediate: true, headers: { "Content-type": "application/json; charset=UTF-8" } }).post(JSON.stringify(allWords.value)).json();
    if(!data?.value) {
      setShowMessage('error', 'В демке запись выключена', `Код ошибки: ${statusCode.value}`, 7000);
    }
    return data.value
  }

  const setIsAdding = (value) => {
    isAdding.value = value;
  }

  // Getters
  const getDictionary = () => {
    return allWords?.value.filter(word => {
      if (!hiddenWords.value.includes(word.id)) return word;
    }) //.slice(0, 2) || [];
  }

  const getShaffledDictionary = () => {
    return shaffleArray(getDictionary());
  }

  // Notifications
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
    getShaffledDictionary,
    getFullDictionary,
    getHiddenDictionary,
    hideWord,
    addWord,
    getGrammar,
    isAdding,
    setIsAdding,
  };
});
