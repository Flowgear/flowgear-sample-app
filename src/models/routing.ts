export type AppRoute = "home" | "workflow" | "customers" | "settings" | "not-found";

export interface HashRouteState {
  route: AppRoute;
  path: string;
  query: Record<string, string>;
  rawHash: string;
}
