import { Flowgear } from "../flowgearSdk";
import type { BasicWebAppResponse } from "../models/basicWebApp";

const BASIC_WEB_APP_ENDPOINT = "/rik-test-basic-web-app-1";

export function getBasicWebAppData(): Promise<BasicWebAppResponse> {
  return Flowgear.Sdk.invoke<BasicWebAppResponse>(
    "GET",
    BASIC_WEB_APP_ENDPOINT,
  );
}
