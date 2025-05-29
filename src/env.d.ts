interface ImportMeta {
  env: {
    NODE_ENV: "development" | "production";
    PORT?: string;
    VITE_BASE_URL: string;
    VITE_API_URL: string;
    PROD: string;
    DEV: string;
  };
}
