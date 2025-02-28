<script setup lang="ts">
//I9UZB7EukaGizTaAfND8ABvgASj8kWfm
import { ref, computed, onMounted } from 'vue';
import { shaffleArray, serbianLC } from "@/common/functions.js";
import { useGlobalStore } from '@/stores/global';
import { useRouter } from "vue-router";

const globalStore = useGlobalStore();
const $router = useRouter();

const visualDictionary = ref([]);

const isAdding = ref<boolean>(false);
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
  if (name) {
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

const closeAdditionWindow = () => {
  userInputError.value = false;
  isAdding.value = false;
  visualDictionary.value = [...userDictionary.value];
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
  <div class="cards-page">
    <div class="loader" v-show="!isAdding && startNewLap">
      <div class="loader__container">...</div>
    </div>




    <div v-if="!isAdding">
      <div class="control-bar">

        <div>
          <button
            @click="setLanguage('rus')"
            class="small-button default"
            :disabled="questionLanguage === 'rus'"
          >
            rus
          </button>
          <button
            @click="setLanguage('srb')"
            class="small-button default"
            :disabled="questionLanguage === 'srb'"
          >
            srb
          </button>
        </div>
      </div>



      <div class="picture">
        <iframe
          :src="funnyPictureSrc"
          v-if="funnyPictureSrc"
          style="width: 200px; height: 200px; border: 0;"
          allowfullscreen
          scrolling="no"
          allow="encrypted-media;"
        />
        <img v-else src="@/assets/vue.svg" alt="default picture" style="width: 64%;" />
      </div>

      <div v-if="visualDictionary && visualDictionary.length">
        <h3 class="question">{{ visualDictionary[0][currentLanguage] }}</h3>
        <div class="reply">
          <h3 class="reply-input">
            <span v-if="showUserReply">{{ visualDictionary[0][questionLanguage] }}</span>
            &nbsp;
          </h3>
          <button @click="userResponse(false)" class="default" :disabled="showUserReply">
            Напомни
          </button>
          <button @click="userResponse(true)" v-if="!showUserReply" class="sucsess">
            Помню
          </button>
          <button @click="fireNextWord()" class="default" v-else>
            Дальше
          </button>
          <br />
          <button
            @click="hideWord(visualDictionary[0].id)"
            class="button-hide"
          >
            Больше не показывай
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cards-page {
  position: relative;
  max-width: 640px;
  margin: auto;
  min-height: 500px;
  .control-bar {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    > div {
      display: inline-block;
    }
  }

  .picture {
    width: 100%;
    height: 200px;
    text-align: center;
    margin-top: 20px;
  }
  .question {
    text-align: center;
  }
  .reply {
    text-align: center;
    button {
      width: 120px;
      &.button-hide {
        width: 246px;
      }
    }
    .reply-input {
      height: 54px;
      padding: 13px;
      margin-bottom: 20px;
      font-weight: 400;
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
  .error {
    border: 1px solid red;
  }
}
</style>
