export function stringIncludesOneOfArray(_str, _arr) {
  let result = false;
  for (let i = 0; i < _arr.length; i++) {
    if (_str.includes(_arr[i].toString())) {
      result = true;
      break;
    }
  }
  return result;
}

export function excludeDuplicatesFromArray(array, field) {
  return array.filter(
    (obj, index, self) =>
      index === self.findIndex((el) => el[field] === obj[field])
  );
}

export function post(url, json, csrf_token) {
  return request(url, "POST", json, csrf_token);
}

export function get(url, params = "", csrf_token) {
  url +=
    params != ""
      ? (url.indexOf("?") === -1 ? "?" : "&") + queryParams(JSON.parse(params))
      : "";
  return get_request(url, "GET", {}, csrf_token);
}

export function del(url, json, csrf_token) {
  return request(url, "DELETE", json, csrf_token);
}

export function put(url, json, csrf_token) {
  return request(url, "PUT", json, csrf_token);
}

export function patch(url, json, csrf_token) {
  return request(url, "PATCH", json, csrf_token);
}

function get_request(url, method, json, csrf_token) {
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
    })
      .then((response) => {
        clearTimeout(timeout);
        return response;
      })
      .then((response) => checkStatus(response, resolve, reject))
      .then(getResponseJson)
      .then((data) => {
        const { isError, ...other } = data;
        if (isError) {
          console.log(other);
          reject(other.error);
        } else resolve(other);
      })
      .catch((error) => {
        console.log("error", error);
        return reject(error);
      });
  });
}

function request(url, method, json, csrf_token) {
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

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    response.isError = false;
    return response;
  } else if (response.status === 403) {
    throw { status: 403, message: "You don't have access" };
  }
  response.isError = true;
  return response;
}

function getResponseJson(response) {
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

function queryParams(params) {
  return Object.keys(params)
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
    .join("&");
}
