abstract class ServiceBase {
  protected static BASE_URL = "";

  protected static getUrl(url: string): string {
    return `/api/${this.BASE_URL}${url}`;
  }

  public static clearedToken = (token: string) => {
    if (token === "null") return undefined;
    const res = token.substring(1, token.length - 1);
    return res;
  };

  public static getBearerToken(): string | undefined {
    const item = localStorage.getItem("wwc-acc");
    return item !== null ? this.clearedToken(item) : undefined;
  }

  public static getRefreshToken(): string | undefined {
    const item = localStorage.getItem("wwc-ref");
    return item !== null ? this.clearedToken(item) : undefined;
  }

  public static setLanguage(code: string): void {
    localStorage.setItem("wwc-lang", code);
  }

  public static getLanguage(): string {
    return localStorage.getItem("wwc-lang") ?? "en";
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
      "ww-lang": ServiceBase.getLanguage(),
      ...options,
    };

    if (headers["Content-Type"] === null) {
      delete headers["Content-Type"];
    }

    const response = await fetch(this.getUrl(url), {
      method,
      body:
        method === "GET"
          ? null
          : headers["Content-Type"]
          ? JSON.stringify(data)
          : data,
      credentials: "include",
      headers,
    });

    return new Promise(async (resolve, reject) => {
      if (response.headers.get("content-type") === "application/pdf") {
        const res = response.blob();
        return resolve(res);
      }
      if (response.status === 401) return reject("You are not authorized");

      const successResult = await response.json();
      if (successResult.success === false) {
        return reject(`${successResult.message} (${successResult.errorCode})`);
      }
      return resolve(successResult);
    });
  }

  protected static get(url: string, data?: any, options?: any): any {
    if (data) {
      [...Object.getOwnPropertyNames(data)].forEach((e) => {
        if (data[e] === undefined) delete data[e];
      });
    }

    const query = data ? `?${new URLSearchParams(data).toString()}` : "";
    return this.http("GET", url + query, data, options);
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

export { ServiceBase };
