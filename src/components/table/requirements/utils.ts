export const inputClass =
  "text-right text-base bg-white rounded-lg placeholder:text-sm !outline-none block w-full p-2.5 border border-secondary-500 focus:border-primary disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-secondary-200";
export const numberWithCommas = (number: number | string) => {
  if (number == null || number === "") return ""; // Handle null, undefined, or empty input
  const num =
    typeof number === "number"
      ? number
      : parseFloat(number.toString().replace(/,/g, ""));
  if (isNaN(num)) return ""; // Handle invalid numbers

  return num.toLocaleString("en-US");
};

export function getCookie(name: string) {
  const cookieName = `${name}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookies = decodedCookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length, cookie.length);
    }
  }
  return "";
}

export function delete_cookie(name: string) {
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

export function setCookie(name: string, value: any, days: number) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
