import { useDateFormat } from '@vueuse/core';

function formatDate(dt: number) {
  const d: any = new Date();
  return useDateFormat(new Date(d - 24 * 60 * 60 * 1000 * dt), 'YYYY-MM-DD').value;
}

function isNotEmpty(obj: any) {
  return obj && typeof obj === 'object' && Object.keys(obj).length !== 0;
}

export { formatDate, isNotEmpty };
