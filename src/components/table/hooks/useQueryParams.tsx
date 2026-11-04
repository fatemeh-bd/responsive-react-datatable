import { useCallback, useSyncExternalStore } from "react";
const eventName = "responsive-datatable:url";
let subscribers = 0;
let restoreHistory: (() => void) | undefined;
const subscribe = (listener: () => void) => {
  if (subscribers++ === 0) {
    const history = window.history;
    const push = history.pushState, replace = history.replaceState;
    const notify = () => window.dispatchEvent(new Event(eventName));
    const wrappedPush: History["pushState"] = function (this: History, ...args) { push.apply(this, args); notify(); };
    const wrappedReplace: History["replaceState"] = function (this: History, ...args) { replace.apply(this, args); notify(); };
    history.pushState = wrappedPush;
    history.replaceState = wrappedReplace;
    restoreHistory = () => {
      if (history.pushState === wrappedPush) history.pushState = push;
      if (history.replaceState === wrappedReplace) history.replaceState = replace;
    };
  }
  window.addEventListener("popstate", listener);
  window.addEventListener(eventName, listener);
  return () => {
    window.removeEventListener("popstate", listener);
    window.removeEventListener(eventName, listener);
    if (--subscribers === 0) { restoreHistory?.(); restoreHistory = undefined; }
  };
};
const snapshot = () => window.location.search;
const serverSnapshot = () => "";
export function useQueryParams() {
  const search = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const getParams = useCallback((key: string) => new URLSearchParams(search).get(key), [search]);
  const setParams = useCallback((values: Record<string, string | null>, replace = true) => {
    const url = new URL(window.location.href);
    Object.entries(values).forEach(([key, value]) => {
      if (value === null) url.searchParams.delete(key);
      else url.searchParams.set(key, value);
    });
    const next = `${url.pathname}${url.search}${url.hash}`;
    if (next === `${window.location.pathname}${window.location.search}${window.location.hash}`) return;
    window.history[replace ? "replaceState" : "pushState"](window.history.state, "", next);
  }, []);
  const updateParams = useCallback((key: string, value: string, replace = true) => setParams({ [key]: value }, replace), [setParams]);
  const removeParams = useCallback((key: string, replace = true) => setParams({ [key]: null }, replace), [setParams]);
  return { getParams, updateParams, removeParams, setParams };
}
