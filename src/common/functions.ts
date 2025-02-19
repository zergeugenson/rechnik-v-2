import { useDateFormat } from '@vueuse/core';

function formatDate(dt: number) {
  const d: any = new Date();
  return useDateFormat(new Date(d - 24 * 60 * 60 * 1000 * dt), 'YYYY-MM-DD').value;
}

function isNotEmpty(obj: any) {
  return obj && typeof obj === 'object' && Object.keys(obj).length !== 0;
}

const ucFirst = (str: string) => {
  if (!str) return str;
  return str[0].toUpperCase() + str.slice(1);
}

const shaffleArray = (array: any) => {
  let currentIndex = array.length,
      randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex]
    ];
  }
  return array;
};

const serbianLC = (str: string) => {
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

export { formatDate, isNotEmpty, shaffleArray, ucFirst, serbianLC };
