#!/usr/bin/env node

import { intervalSince } from "./timeBetween.js";

var arg = "-c";
var treatment = "";
var restype;

if (process.argv.length < 3) {
  var e = new Error("Filename required");
  throw e;
} else if (process.argv.length === 4) {
  treatment = process.argv.slice(3)[0];
  var arg = process.argv.slice(2)[0];
} else {
  treatment = process.argv.slice(2)[0];
}

if (arg == "-c") {
  restype = "complete";
}

console.log(intervalSince(treatment, restype));
