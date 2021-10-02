#!/usr/bin/env node

if (process.argv.length < 3) {
  var e = new Error("Filename required");
  throw e;
}

var durationSince = (treatment) => {
  var nTxDate = treatment.replaceAll(/-/g, "/");
  var fields = nTxDate.split(/\//);
  var finalString;
  if (fields.length < 3) {
    finalString = [fields[0], "1", fields[1]].join("/");
  } else {
    finalString = fields.join("/");
  }
  const txDate = new Date(finalString);
  const now = new Date();
  const dateDiff = now - txDate;
  const years = Math.floor(dateDiff / 31536000000);
  const months = Math.round((dateDiff / 31536000000 - years) * 12);
  return String(years) + " years and " + String(months) + " months";
};

const inputString = process.argv.slice(2)[0];
console.log(durationSince(inputString));
