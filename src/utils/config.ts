interface AppConfig {
  baseUrl: string;
  mode: string;
}

export const config: AppConfig = {
  baseUrl: import.meta.env.VITE_API_URL,
  mode: import.meta.env.MODE,
};