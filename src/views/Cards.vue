<script setup lang="ts">
//I9UZB7EukaGizTaAfND8ABvgASj8kWfm
import { ref, computed, onMounted } from 'vue';
import { shaffle } from "@/common/functions.js";
import { useGlobalStore } from '@/stores/global';

const globalStore = useGlobalStore();

const SerbLowerCase = (str: string) => {
  return Array.from(str).reduce((word, letter) => {
    switch (letter) {
      case "C":
        letter = "ć";
        break;
      case "D":
        letter = "đ";
        break;
      case "S":
        letter = "ŝ";
        break;
      case "Z":
        letter = "ž";
    }
    // ć U+0107 &#263;
    // đ U+0111 &#273;
    // ŝ U+015D &#349;
    // ž U+017D &#382;
    return (word += letter);
  }, "");
};

const visualDictionary = ref([]);
const newWord = ref( { srb: '', rus: '', eng: '' });
const adding = ref<boolean>(false);
const funnyPictureSrc = ref<string>('');
const q_lang = ref('srb');
const c_lang = ref('rus');
const error = ref<boolean>(false)
const showReply = ref<boolean>(false);
const startNewLap = ref<boolean>(false);

const rechnik = computed( () => {
      return globalStore.getShaffledRechnik();
    });

const getData = () => {
  Promise.all([globalStore.getFullDictionary(), globalStore.getHiddenDictionary()]).then(() => {
    visualDictionary.value = [...rechnik.value]
    fireNextWord();
  }).catch(error => {
    console.error("Ошибка получения данных", error)
  })
}

const fireNextWord = () => {
  showReply.value = false;
  if (!visualDictionary.value.length) {
    startNewLap.value = true;
    setTimeout(() => {
      visualDictionary.value = [...globalStore.getShaffledRechnik()];
      startNewLap.value = false;
    }, 1600);
  }
  visualDictionary.value = shaffle(visualDictionary.value);
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
  q_lang.value = "srb";
  c_lang.value = "rus";
  if (lang === "rus") {
    q_lang.value = "rus";
    c_lang.value = "srb";
  }
};

const closeAdditionWindow = () => {
  error.value = false;
  adding.value = false;
  visualDictionary.value = [...rechnik.value];
};

const userResponse = (rightAnswer) => {
  showReply.value = true;
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
  await globalStore.hideWord();
  fireNextWord();
}

async function addWord() {
  if (!newWord.value.srb || !newWord.value.rus) {
    error.value = true;
    return;
  }

  globalStore.allWords.push( {
    srb: SerbLowerCase(newWord.value.srb),
    rus: newWord.value.rus,
    eng: newWord.value.eng,
    id: Date.now()
  });

  const success = await globalStore.addWord();
  if (success) {
    newWord.value = { srb: "", rus: "", eng: "" };
    error.value = false;
  } else {
    console.error("Ошибка записи словаря");
  }
}

onMounted(() => {
  getData();
});
















</script>

<template>
  <div class="rechnik-page">
<!--    <img src="@/assets/vue.svg" class="logo vue" alt="Vue logo" />-->
    <div class="loader-container" v-show="!adding && startNewLap">
      <div class="loader">...</div>
    </div>
    <div v-if="!adding">
      <div class="control-bar">
        <div>
          <button
            class="small-button grammar"
            @click="$router.push({ name: 'Grammar' })"
          >
            grammar
          </button>
        </div>
        <div>
          <button
            @click="setLanguage('rus')"
            class="small-button default"
            :disabled="q_lang === 'rus'"
          >
            rus
          </button>
          <button
            @click="setLanguage('srb')"
            class="small-button default"
            :disabled="q_lang === 'srb'"
          >
            srb
          </button>
          <button @click="adding = true" class="small-button danger">
            add
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
        <h3 class="question">{{ visualDictionary[0][c_lang] }}</h3>
        <div class="reply">
          <h3 class="reply-input">
            <span v-if="showReply">{{ visualDictionary[0][q_lang] }}</span>
            &nbsp;
          </h3>
          <button @click="userResponse(false)" class="default" :disabled="showReply">
            Напомни
          </button>
          <button @click="userResponse(true)" v-if="!showReply" class="sucsess">
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
    <div v-else class="adding">
      <input
        type="text"
        placeholder="По-сербски"
        v-model="newWord.srb"
        :class="['reply-input', { error: error }]"
      />
      <input
        type="text"
        placeholder="По-русски"
        v-model="newWord.rus"
        :class="['reply-input', { error: error }]"
      />
      <input
        type="text"
        placeholder="По-английски"
        v-model="newWord.eng"
        style="margin-bottom: 50px;"
      />
      <button @click="addWord">Сохранить</button>
      <button @click="closeAdditionWindow">Закончить</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.rechnik-page {
  position: relative;
  padding: 15px;
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
  .adding {
    text-align: center;
    padding-top: 50px;
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
  .loader-container {
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
  .loader,
  .loader:after {
    border-radius: 50%;
    width: 10em;
    height: 10em;
  }
  .loader {
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
