<script setup lang="ts">
//I9UZB7EukaGizTaAfND8ABvgASj8kWfm
import { ref, onMounted } from "vue";
import { shaffleArray, serbianLC, ucFirst } from "@/common/functions.js";
import { useGlobalStore } from "@/stores/global";
import type { Dictionary } from "@/interfaces/interfaces";

const globalStore = useGlobalStore();

const visualDictionary = ref<any>([]);

const funnyPictureSrc = ref<string>("");
const questionLanguage = ref<string>("srb");
const currentLanguage = ref<string>("rus");
const showUserReply = ref<boolean>(false);
const startNewSession = ref<boolean>(false);

const fireNextWord = () => {
  showUserReply.value = false;
  if (!visualDictionary.value.length) {
    visualDictionary.value = [...globalStore.getDictionary()];
    startNewSession.value = true;
    setTimeout(() => {
      startNewSession.value = false;
    }, 1600);
  }
  visualDictionary.value = shaffleArray(visualDictionary.value);
  getFunnyPicture();
};

async function getFunnyPicture() {
  let name: string = visualDictionary?.value[0]?.eng;

  if (!name) {
    funnyPictureSrc.value = "";
    return;
  } else {
    name.replace(/\s/g, "%20");
  }
  try {
    const response = await fetch(
      "http://api.giphy.com/v1/gifs/search?api_key=I9UZB7EukaGizTaAfND8ABvgASj8kWfm&limit=1&q=" +
        name,
    );
    const json = await response.json();
    funnyPictureSrc.value = json.data[0].embed_url;
  } catch (error) {
    console.error("Ошибка получения картинки", error);
  }
}

const setLanguage = (lang: string) => {
  questionLanguage.value = "srb";
  currentLanguage.value = "rus";
  if (lang === "rus") {
    questionLanguage.value = "rus";
    currentLanguage.value = "srb";
  }
};

const userResponse = (rightAnswer: boolean) => {
  showUserReply.value = true;
  if (rightAnswer) {
    setTimeout(() => {
      visualDictionary.value.splice(0, 1);
      fireNextWord();
    }, 1600);
  }
};

async function hideWord(id: number) {
  if (!id) return;
  visualDictionary?.value?.splice(0, 1);
  globalStore.allWords.forEach((word: Dictionary) => {
    if (word.id === id) {
      word.hidden = true;
    }
  });
  const success = await globalStore.saveDictionary();
  if (!success?.length) console.error("Ошибка: слово не спрятано");
  fireNextWord();
}

const getData = () => {
  globalStore.getFullDictionary().then(() => fireNextWord());
};

onMounted(() => {
  getData();
});
</script>

<template>
  <div class="cards-page mt-3">
    <div class="relative text-sm flex">
      <span>Язык:</span>
      <span
        @click="setLanguage('rus')"
        :class="['text-button', { disabled: questionLanguage === 'rus' }]"
        >русский</span
      >
      <span>|</span>
      <span
        @click="setLanguage('srb')"
        :class="['text-button', { disabled: questionLanguage === 'srb' }]"
        >сербский</span
      >
    </div>

    <ProgressSpinner
      v-show="startNewSession"
      class="cards-page__progress-spinner"
      strokeWidth="3"
      fill="transparent"
      animationDuration="3s"
      aria-label="Custom ProgressSpinner"
    />

    <div
      class="card-body flex flex-col items-center w-full mt-3"
      v-if="visualDictionary && visualDictionary.length && !startNewSession"
    >
      <div class="card-body__picture">
        <div
          class="card-body__picture-curtain w-full h-full"
          @mouseenter.stop
        ></div>
        <iframe
          class="card-body__picture-iframe"
          :src="funnyPictureSrc"
          v-show="funnyPictureSrc"
          allowfullscreen
          scrolling="no"
          allow="encrypted-media;"
        />
      </div>

      <div class="text-base mt-3 text-center">
        {{ ucFirst(serbianLC(visualDictionary[0][currentLanguage] || "")) }}
      </div>
      <div class="card-body__reply text-base text-center font-bold mt-3 mb-3">
        <span>{{
          showUserReply
            ? ucFirst(serbianLC(visualDictionary[0][questionLanguage]))
            : "..."
        }}</span>
      </div>

      <div class="card-body__controls mt-3 text-center">
        <Button
          @click="userResponse(false)"
          class="default mr-2"
          :disabled="showUserReply"
          size="small"
          severity="success"
        >
          Напомни
        </Button>
        <Button
          @click="userResponse(true)"
          v-if="!showUserReply"
          severity="info"
          size="small"
        >
          Помню
        </Button>
        <Button @click="fireNextWord()" v-else size="small" severity="success">
          Дальше
        </Button>
        <br />
        <Button
          @click="hideWord(visualDictionary[0].id)"
          class="button-hide mt-2"
          severity="warn"
        >
          Больше не показывай
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cards-page {
  &__progress-spinner {
    position: absolute;
    top: calc(50% - 50px);
    left: calc(50% - 50px);
  }
  .card-body {
    &__picture {
      position: relative;
      aspect-ratio: 1 / 1;
      display: block;
      margin-left: auto;
      margin-right: auto;
      width: 100%;
      @include fmob {
        max-height: 480px;
      }
      @include ftab {
        max-height: 440px;
      }
    }
    &__picture-iframe {
      min-width: 100%;
      width: auto;
      height: 100%;
      border: 0;
      background: #f9f9f9;
      z-index: 0;
    }
    &__picture-curtain {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
    }
    &__reply {
      padding: 0.3rem;
    }
    &__controls {
      button {
        width: 120px;
        &.button-hide {
          width: 246px;
        }
      }
    }
  }
}
</style>
