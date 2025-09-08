import { useState, useCallback, useEffect } from "react";

export function useQueryParams() {
  // یک state داخلی برای trigger کردن re-render
  const [, setVersion] = useState(0);

  // تابع برای خواندن پارامترها
  const getParams = useCallback((key?: string) => {
    const searchParams = new URLSearchParams(window.location.search);

    if (key) return searchParams.get(key) || "";

    const params: Record<string, string> = {};
    searchParams.forEach((value, k) => {
      params[k] = value;
    });
    return params;
  }, []);

  // تابع برای بروزرسانی پارامترها
  const updateParams = useCallback(
    (
      keyOrParams:
        | string
        | Record<string, string | number | boolean | null | undefined>,
      value?: string | number | boolean | null | undefined
    ) => {
      const searchParams = new URLSearchParams(window.location.search);

      if (typeof keyOrParams === "string") {
        if (value === null || value === undefined) {
          searchParams.delete(keyOrParams);
        } else {
          searchParams.set(keyOrParams, String(value));
        }
      } else {
        Object.entries(keyOrParams).forEach(([key, val]) => {
          if (val === null || val === undefined) {
            searchParams.delete(key);
          } else {
            searchParams.set(key, String(val));
          }
        });
      }

      const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
      window.history.replaceState(null, "", newUrl);

      // trigger re-render برای هماهنگی با React
      setVersion((v) => v + 1);
    },
    []
  );

  // listener برای تغییرات URL (مثل back/forward browser)
  useEffect(() => {
    const handlePopState = () => {
      setVersion((v) => v + 1);
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return { getParams, updateParams };
}
