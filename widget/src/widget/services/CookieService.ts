/**
 * Устанавливает cookie в браузере.
 *
 * @param name - Имя cookie
 * @param value - Значение cookie
 * @param options - Дополнительные параметры
 * @example
 * setCookie("token", "abc123", { path: "/", maxAge: 3600, secure: true });
 */
export function setCookie(
  name: string,
  value: string,
  options: {
    path?: string;
    domain?: string;
    maxAge?: number;
    expires?: Date;
    secure?: boolean;
    sameSite?: "Strict" | "Lax" | "None";
  } = {}
): void {
  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (options.path) {
    cookieString += `; path=${options.path}`;
  }

  if (options.domain) {
    cookieString += `; domain=${options.domain}`;
  }

  if (options.maxAge !== undefined) {
    cookieString += `; max-age=${options.maxAge}`;
  }

  if (options.expires) {
    cookieString += `; expires=${options.expires.toUTCString()}`;
  }

  if (options.secure) {
    cookieString += "; secure";
  }

  if (options.sameSite) {
    cookieString += `; samesite=${options.sameSite}`;
  }

  document.cookie = cookieString;
}

/**
 * Получает значение cookie по имени.
 *
 * @param name - Имя cookie
 * @returns Значение cookie или undefined, если cookie не существует
 *
 * @example
 * const token = getCookie("token");
 * if (token) console.log("Авторизован");
 */
export function getCookie(name: string): string | undefined {
  const cookieString = document.cookie;
  const encodedName = encodeURIComponent(name) + "=";

  const cookies = cookieString.split("; ").find(cookie => cookie.startsWith(encodedName));

  if (!cookies) return undefined;

  return decodeURIComponent(cookies.substring(encodedName.length));
}
