const setServerUrl = (): string | undefined => {
  return import.meta.env.VITE_CHAT_API_URL;
};

export const CHAT_URL = setServerUrl();

export abstract class ChatsBase {
  protected static BASE_URL = "";
  protected static getUrl(url: string): string {
    return `${import.meta.env.VITE_CHAT_API_URL}/${this.BASE_URL}${url}`;
  }

  public static clearToken = (token: string) => {
    const res = token.substring(1, token.length - 1);
    return res;
  };

  public static getBearerToken(): string | undefined {
    const item = localStorage.getItem("wwc-acc");
    return item !== null ? this.clearToken(item) : undefined;
  }

  public static getRefreshToken(): string | undefined {
    const item = localStorage.getItem("wwc-ref");
    return item !== null ? this.clearToken(item) : undefined;
  }

  protected static async http(
    method: string,
    url: string,
    data?: any,
    options?: any
  ): Promise<any> {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...options,
    };

    if (headers["Content-Type"] === null) {
      delete headers["Content-Type"];
    }

    const originalRequest = await fetch(this.getUrl(url), {
      method,
      body: headers["Content-Type"] ? JSON.stringify(data) : data,
      headers,
      credentials: "include",
    });

    if (originalRequest.status >= 400) {
      return new Promise((_, reject) => {
        reject(originalRequest);
      });
    }

    return new Promise((resolve) => {
      return resolve(originalRequest.json());
    });
  }

  protected static get(url: string, data?: any, options?: any): any {
    return this.http("GET", url, data, options);
  }

  protected static post(url: string, data?: any, options?: any): any {
    return this.http("POST", url, data, options);
  }

  protected static put(url: string, data?: any, options?: any): any {
    return this.http("PUT", url, data, options);
  }

  protected static delete(url: string, data?: any, options?: any): any {
    return this.http("DELETE", url, data, options);
  }
}
