<script setup lang="ts">
//I9UZB7EukaGizTaAfND8ABvgASj8kWfm
import { ref, computed, onMounted } from 'vue';
import { shaffleArray, serbianLC } from "@/common/functions.js";
import { useGlobalStore } from '@/stores/global';
import { useRouter } from "vue-router";

const globalStore = useGlobalStore();
const $router = useRouter();

const visualDictionary = ref([]);

const funnyPictureSrc = ref<string>('');
const questionLanguage = ref('srb');
const currentLanguage = ref('rus');

const showUserReply = ref<boolean>(false);
const startNewLap = ref<boolean>(false);

const userDictionary = computed( () => {
  return globalStore.getShaffledDictionary();
});

const fireNextWord = () => {
  showUserReply.value = false;
  if (!visualDictionary.value.length) {
    startNewLap.value = true;
    setTimeout(() => {
      visualDictionary.value = [...userDictionary.value];
      startNewLap.value = false;
    }, 1600);
  }
  visualDictionary.value = shaffleArray(visualDictionary.value);
  getFunnyPicture();
};

async function getFunnyPicture() {
  let name = visualDictionary.value[0].eng;
  if (!name) {
    funnyPictureSrc.value = '';
    return;
  } else {
    name.replace(/\s/g, "%20");
  }
  try {
    const response = await fetch("http://api.giphy.com/v1/gifs/search?api_key=I9UZB7EukaGizTaAfND8ABvgASj8kWfm&limit=1&q=" + name);
    const json = await response.json();
    funnyPictureSrc.value = json.data[0].embed_url;
  } catch (error) {
    console.error("Ошибка получения картинки", error);
  }
}

const setLanguage = (lang) => {
  questionLanguage.value = "srb";
  currentLanguage.value = "rus";
  if (lang === "rus") {
    questionLanguage.value = "rus";
    currentLanguage.value = "srb";
  }
};


const userResponse = (rightAnswer) => {
  showUserReply.value = true;
  if (rightAnswer) {
    setTimeout(() => {
      visualDictionary.value.splice(0, 1);
      fireNextWord();
    }, 1500);
  }
};

async function hideWord (id) {
  if (globalStore.hiddenWords.includes(id)) {
    globalStore.hiddenWords = globalStore.hiddenWords.filter(item => item !== id);
  } else {
    globalStore.hiddenWords.push(id);
  }
  const success = await globalStore.hideWord();
  if (success?.length) {
    fireNextWord();
  } else {
    console.error("Ошибка: слово не спрятано");
  }
}

const getData = () => {
  Promise.all([globalStore.getFullDictionary(), globalStore.getHiddenDictionary()]).then(() => {
    visualDictionary.value = [...userDictionary.value]
    fireNextWord();
  }).catch(error => {
    console.error("Ошибка получения данных", error)
  })
}

onMounted(() => {
  getData();
});

</script>

<template>
  <div class="cards-page mt-3">

    <div class="control-bar text-sm flex ">
      <span>Язык:</span>
      <span @click="setLanguage('rus')" :class="['control-bar__button', 'text-button', {disabled: questionLanguage === 'rus'}]">русский</span>
      <span>|</span>
      <span @click="setLanguage('srb')" :class="['control-bar__button', 'text-button', {disabled: questionLanguage === 'srb'}]">сербский</span>
    </div>

    <div class="loader" v-show="startNewLap">
      <div class="loader__container">...</div>
    </div>



    <div class="card-body mt-3" v-if="visualDictionary && visualDictionary.length">

      <div class="card-body__picture">
        <iframe
            class="card-body__picture-iframe"
            :src="funnyPictureSrc"
            v-if="funnyPictureSrc"
            style="width: auto; height: 100%; border: 0; background: #f9f9f9"
            allowfullscreen
            scrolling="no"
            allow="encrypted-media;"
        />
        <img v-else src="@/assets/vue.svg" alt="default picture" style="width: auto; height: 100%;" />
      </div>


      <div>
      <div class="text-base mt-3 text-center">{{ visualDictionary[0][currentLanguage] }}</div>
      <div class="card-body__reply text-base text-center font-bold mt-3 mb-3">
        <span v-if="showUserReply">{{ visualDictionary[0][questionLanguage] }}</span>
        &nbsp;
      </div>

      <div class="card-body__controls mt-3">
        <Button @click="userResponse(false)" class="default mr-2" :disabled="showUserReply" size="small" severity="success">
          Напомни
        </Button>
        <Button @click="userResponse(true)" v-if="!showUserReply" severity="info" size="small">
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
  </div>
</template>

<style scoped lang="scss">
.cards-page {
  .control-bar {
    position: relative;
  }
  .card-body {
    display: flex;
    width: 100%;
    align-items: center;
    flex-direction: column;
    &__picture {
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
    }
    &__reply {
      border: 1px dashed #e5e5e5;
      background: #f9f9f9;
      padding: 0.3rem;
    }
    &__controls {
      text-align: center;
      button {
        width: 120px;
        &.button-hide {
          width: 246px;
        }
      }
    }
  }

  .loader {
    border: 1px solid rgba(255, 255, 255, 0.2);
    float: left;
    overflow: hidden;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    position: absolute;
    background: white;
    z-index: 1;
    width: 100%;
    height: 100%;
  }
  .loader-container,
  .loader-container:after {
    border-radius: 50%;
    width: 10em;
    height: 10em;
  }
  .loader-container {
    margin: calc(50% - 100px) auto;
    font-size: 10px;
    position: relative;
    text-indent: -9999em;
    border-top: 1.1em solid rgba(13, 197, 193, 0.2);
    border-right: 1.1em solid rgba(13, 197, 193, 0.2);
    border-bottom: 1.1em solid rgba(13, 197, 193, 0.2);
    border-left: 1.1em solid #ffffff;
    -webkit-transform: translateZ(0);
    -ms-transform: translateZ(0);
    transform: translateZ(0);
    -webkit-animation: load8 1.1s infinite linear;
    animation: load8 0.75s infinite linear;
  }
  @-webkit-keyframes load8 {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  @keyframes load8 {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
}
</style>
