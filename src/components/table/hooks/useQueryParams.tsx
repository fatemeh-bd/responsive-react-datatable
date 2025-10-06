import { useCallback, useEffect, useState } from "react";

export function useQueryParams() {
  const [search, setSearch] = useState(() => window.location.search);

  useEffect(() => {
    const onPopState = () => {
      setSearch(window.location.search);
    };
    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  const getParams = useCallback(
    (key: string) => {
      const params = new URLSearchParams(search);
      return params.get(key);
    },
    [search]
  );

  const updateParams = useCallback(
    (key: string, value: string, replace: boolean = true) => {
      const params = new URLSearchParams(window.location.search);
      params.set(key, value);

      const queryString = params.toString();
      const newUrl = queryString
        ? `${window.location.pathname}?${queryString}`
        : window.location.pathname;

      if (replace) {
        window.history.replaceState({}, "", newUrl);
      } else {
        window.history.pushState({}, "", newUrl);
      }

      setSearch(window.location.search);
    },
    []
  );

  const removeParams = useCallback((key: string, replace: boolean = true) => {
    const params = new URLSearchParams(window.location.search);
    params.delete(key);

    const queryString = params.toString();
    const newUrl = queryString
      ? `${window.location.pathname}?${queryString}`
      : window.location.pathname;

    if (replace) {
      window.history.replaceState({}, "", newUrl);
    } else {
      window.history.pushState({}, "", newUrl);
    }

    setSearch(window.location.search);
  }, []);

  return { getParams, updateParams, removeParams };
}
