export function isUserLoggedIn() {
  if (typeof document === "undefined") return false;
  return document.cookie.includes("user_token=");
}

export function getUserToken() {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/user_token=([^;]+)/);
  return match ? match[1] : null;
}

export function getUserId() {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/user_id=([^;]+)/);
  return match ? match[1] : null;
}

export function removeUserToken() {
  if (typeof document === "undefined") return;
  document.cookie =
    "user_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
// BILLAG https://www.mbloging.com/post/how-to-read-write-and-delete-cookies-in-javascript
