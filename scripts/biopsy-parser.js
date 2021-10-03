#!/usr/bin/env node

import { readFileSync } from "fs";
import { parseBiopsy } from "./parseBiopsy.js";

if (process.argv.length < 3) {
  var e = new Error("Filename required");
  throw e;
}

const fname = process.argv.slice(2)[0];
var data = readFileSync(fname, "utf8");

const parsed_result = parseBiopsy(data);

console.log(parsed_result.summary);
