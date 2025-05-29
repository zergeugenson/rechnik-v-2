import { createFetch } from "@vueuse/core";

export const myFetchOnError = (error: {
  data: any;
  response: Response | null;
  error: any;
}) => {
  if (!error.response?.status?.toString().startsWith("2")) {
    console.log("myFetchError: ", error.response?.status);
  }
  return error;
};

const useMyFetch = createFetch({
  baseUrl: "",
  combination: "overwrite",
  options: {
    onFetchError: myFetchOnError,
  },
});

export default useMyFetch;
