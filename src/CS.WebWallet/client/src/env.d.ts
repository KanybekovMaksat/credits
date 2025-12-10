/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CHAT_API_URL: string;
  readonly VITE_APP_KEY: string;
  readonly VITE_BRANCH_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
