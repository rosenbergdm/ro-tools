/**
 *  timeBetween.js
 *
 */

export const durationSince = (treatment) => {
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
  return [Number(years), Number(months)];
  // return String(years) + " years and " + String(months) + " months";
};

export const intervalSince = (treatment, restype = "complete") => {
  const interval_since = durationSince(treatment);
  if (restype == "complete") {
    return (
      String(interval_since[0]) +
      " years and " +
      String(interval_since[1]) +
      " months since completion of RT on " +
      treatment
    );
  }
  return (
    String(interval_since[0]) +
    " years and " +
    String(interval_since[1]) +
    " months"
  );
};

export default intervalSince;
