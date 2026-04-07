export interface BasicWebAppItem {
  name: string;
}

export interface BasicWebAppResponse {
  result?: {
    items?: BasicWebAppItem[];
  };
}
