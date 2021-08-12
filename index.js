// import * as Other from "./utils/other.js";
// import * as Request from "./utils/request.js";

const Other = require("./utils/other.js");
const Request = require("./utils/request.js");
//
// exports.Other = Other;
// exports.Request = Request;

export function UseOther() {
  return Other;
}
export function UseRequest() {
  return Request;
}
