import type { AppRoute, HashRouteState } from "../models/routing";

const ROUTE_BY_PATH: Record<string, AppRoute> = {
  "/": "home",
  "/workflow": "workflow",
  "/customers": "customers",
  "/settings": "settings",
};

function normalizePath(pathValue: string): string {
  const withLeadingSlash = pathValue.startsWith("/")
    ? pathValue
    : `/${pathValue}`;
  const withoutTrailingSlashes = withLeadingSlash.replace(/\/+$/g, "");
  return withoutTrailingSlashes === "" ? "/" : withoutTrailingSlashes;
}

export function parseHashRoute(hashValue: string): HashRouteState {
  const rawHash = hashValue ?? "";
  const hashWithoutPrefix = rawHash.startsWith("#")
    ? rawHash.slice(1)
    : rawHash;
  const normalizedHash = hashWithoutPrefix.trim();

  const questionMarkIndex = normalizedHash.indexOf("?");
  const rawPath =
    questionMarkIndex >= 0
      ? normalizedHash.slice(0, questionMarkIndex)
      : normalizedHash;
  const rawQuery =
    questionMarkIndex >= 0 ? normalizedHash.slice(questionMarkIndex + 1) : "";

  const normalizedPath = normalizePath(rawPath || "/");
  const query = Object.fromEntries(new URLSearchParams(rawQuery).entries());
  const route = ROUTE_BY_PATH[normalizedPath] ?? "not-found";

  return {
    route,
    path: normalizedPath,
    query,
    rawHash,
  };
}

export function createHashRoute(
  path: string,
  query?: Record<string, string>,
): string {
  const normalizedPath = normalizePath(path);
  const searchParams = new URLSearchParams(query);
  const queryString = searchParams.toString();
  return queryString.length > 0
    ? `#${normalizedPath}?${queryString}`
    : `#${normalizedPath}`;
}
