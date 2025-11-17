/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GENERATE_OAUTH_URL: string;
  readonly VITE_GOOGLE_CALLBACK_BE_URL: string;
  readonly VITE_BACK_END_HOST: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
