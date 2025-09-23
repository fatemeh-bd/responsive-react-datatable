import { useCallback, useEffect, useState } from "react";

export function useQueryParams() {
  const [search, setSearch] = useState(() => window.location.search);

  // وقتی history تغییر کرد گوش بده
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

  const updateParams = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value) params.set(key, value);
    else params.delete(key);

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, "", newUrl);

    // دستی state رو آپدیت می‌کنیم تا re-render بشه
    setSearch(window.location.search);
  }, []);

  return { getParams, updateParams };
}
