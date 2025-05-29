import { ref } from "vue";
import { defineStore } from "pinia";
import { shaffleArray } from "@/common/functions.js";
import useFetch from "@/api/myFetsh";
import type { Dictionary, Grammar } from "@/interfaces/interfaces";

export const apiURL: string = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL
  : window.location.origin + "/assets";
const wordsInSecssion: number = 25;

export const useGlobalStore = defineStore("global", () => {
  // Store
  const allWords = ref<Dictionary[]>([]);
  const grammarRules = ref<Grammar>({});
  const isAdding = ref<boolean>(false);

  // Actions
  async function getFullDictionary() {
    const { data, statusCode } = await useFetch(`${apiURL}/data.json`, {
      immediate: true,
    })
      .get()
      .json();
    if (data?.value) {
      allWords.value = data.value;
    } else {
      setShowMessage(
        "error",
        "Ошибка получения словаря",
        `Код ошибки: ${statusCode.value}`,
        7000,
      );
    }
    return data.value;
  }

  async function getGrammar() {
    const { data, statusCode } = await useFetch(`${apiURL}/grammar.json`, {
      immediate: true,
    })
      .get()
      .json();
    if (data?.value) {
      grammarRules.value = data.value;
    } else {
      setShowMessage(
        "error",
        "Ошибка файла грамматики",
        `Код ошибки: ${statusCode.value}`,
        7000,
      );
    }
    return data.value || [];
  }

  async function saveDictionary() {
    const { data, statusCode } = await useFetch(`${apiURL}/replace.php`, {
      immediate: true,
    })
      .post(JSON.stringify(allWords.value))
      .json();
    if (!data?.value) {
      setShowMessage(
        "error",
        "В демке запись выключена",
        `Код ошибки: ${statusCode.value}`,
        7000,
      );
    }
    return data.value;
  }

  const setIsAdding = (value: boolean) => {
    isAdding.value = value;
  };

  // Getters

  const getDictionary = () => {
    return (
      shaffleArray(
        allWords?.value.filter((word: Dictionary) => !word.hidden),
      ).slice(0, wordsInSecssion) || []
    );
  };

  // Notifications
  const showMessage = ref({
    severity: "error",
    summary: "",
    detail: "",
    life: 3000,
  });
  const setShowMessage = (
    severity = "error",
    summary = "",
    detail = "",
    life = 3000,
  ) => {
    showMessage.value = { severity, summary, detail, life };
  };

  const showError = (err: any) => {
    err = err.toString();
    let detail = "Неизвестная ошибка";
    if (/^4/.test(err)) detail = "Неправильные параметры запроса";
    else if (/^5/.test(err)) detail = "Ошибка сервера";
    showMessage.value = {
      severity: "error",
      summary: "Ошибка",
      detail: detail,
      life: 10000,
    };
  };

  return {
    showMessage,
    allWords,
    grammarRules,
    setShowMessage,
    showError,
    getDictionary,
    getFullDictionary,
    saveDictionary,
    getGrammar,
    isAdding,
    setIsAdding,
  };
});
