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

const shaffle = (array: any) => {
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

export { formatDate, isNotEmpty, shaffle, ucFirst };
