module.exports = class Request {
  Post(url, json, csrf_token) {
    return request(url, "POST", json, csrf_token);
  }

  Get(url, params = "", csrf_token) {
    url +=
      params != ""
        ? (url.indexOf("?") === -1 ? "?" : "&") +
          queryParams(JSON.parse(params))
        : "";
    return request(url, "GET", {}, csrf_token);
  }

  Del(url, json, csrf_token) {
    return request(url, "DELETE", json, csrf_token);
  }

  Put(url, json, csrf_token) {
    return request(url, "PUT", json, csrf_token);
  }

  Patch(url, json, csrf_token) {
    return request(url, "PATCH", json, csrf_token);
  }

  request(url, method, json, csrf_token) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(function () {
        reject(new Error("Request timed out"));
      }, CON_TIMEOUT);
      fetch(url, {
        method,
        credentials: "same-origin",
        mode: "cors",
        headers: new Headers({
          Authorization: "Bearer " + csrf_token,
          "Access-Control-Allow-Origin": "*",
          Accept: "application/json",
          "Content-Type": "application/json; charset=UTF-8",
          // "X-CSRF-Token": csrf_token
        }),
        body: JSON.stringify(json),
      })
        .then((response) => {
          clearTimeout(timeout);
          return response;
        })
        .then((response) => checkStatus(response))
        .then(getResponseJson)
        .then((data) => {
          const { isError, ...other } = data;
          if (isError) {
            reject(other);
          } else resolve(other);
        })
        .catch((error) => reject(error));
    });
  }

  checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      response.isError = false;
      return response;
    } else if (response.status === 403) {
      throw { status: 403, message: "You don't have access" };
    }
    response.isError = true;
    return response;
  }

  getResponseJson(response) {
    return response
      .json()
      .then((data) => {
        data.isError = response.isError;
        return data;
      })
      .catch((e) => {
        return e;
      });
  }

  queryParams(params) {
    return Object.keys(params)
      .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
      .join("&");
  }
};
