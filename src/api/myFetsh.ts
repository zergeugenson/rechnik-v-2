import { createFetch } from '@vueuse/core';

export const envUrl = import.meta.env.VITE_BASE_URL !== undefined ? import.meta.env.VITE_BASE_URL : '';
// export const baseUrl = import.meta.env.PROD ? `${envUrl}/api` : '';
export const baseUrl = import.meta.env.PROD ? `${envUrl}/api` : '/proxy';

export const myFetchOnError = (error: { data: any; response: Response | null; error: any }) => {
  if (error.response?.status === 401 || error.response?.status === 403) {
    console.log("Error: ", error.response?.status )
  }
  return error;
};

const useMyFetch = createFetch({
  baseUrl,
  combination: 'overwrite',
  options: {
    onFetchError: myFetchOnError
  }
});

export default useMyFetch;
