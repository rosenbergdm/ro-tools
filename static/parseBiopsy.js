/**
 * @class       : parseBiopsy
 * @author      : David M. Rosenberg (dmr@davidrosenberg.me)
 * @created     : Sunday Aug 08, 2021 09:46:48 CDT
 * @description : parseBiopsy
 */

const fs = require('fs')
const rawtext = fs.readFileSync('/Users/davidrosenberg/temp.prostatebiopsy.txt', 'utf8')

var makeRegion = function (
  rname = "",
  cores = [0, 1],
  gleason = [0, 0],
  involvement = 0,
  ece = false,
  svi = false
) {
  var region = {
    rname: rname,
    cores: cores,
    gleason: gleason,
    involvement: involvement,
    ece: ece,
    svi: svi,
  };
  return region;
};

var sumCores = function (c1, c2) {
  return [c1[0] + c2[0], c1[1] + c2[1]];
};

var higherGleason = function (g1, g2) {
  if (g1[0] + g1[1] >= g2[0] + g2[1] && g1[0] >= g2[0]) {
    return g1;
  } else if (g1[0] + g1[1] < g2[0] + g2[1]) {
    return g2;
  } else {
    return g1[0] > g2[0] ? g1 : g2;
  }
};

var addNewRegion = function (newRegion, workingRegions) {
  if (Object.keys(workingRegions).includes(newRegion.rname)) {
    var oldRegion = workingRegions[newRegion.rname];
    workingRegions[newRegion.rname] = {
      ...oldRegion,
      cores: sumCores(oldRegion.cores, newRegion.cores),
      gleason: higherGleason(oldRegion.gleason, newRegion.gleason),
      involvement: Math.max(oldRegion.involvement, newRegion.involvement),
      ece: oldRegion.ece || newRegion.ece,
      svi: oldRegion.svi || newRegion.svi,
    };
  } else {
    workingRegions[newRegion.rname] = newRegion;
  }
  return workingRegions;
};

var getRegion = function (text) {
  // console.log(`trying to make a region from "${text}"`);
  const gleasonScore = getGleasonScore(text);
  var newRegion;
  if (gleasonScore[0] == 0) {
    newRegion = makeRegion(getRegionName(text).rname);
  } else {
    newRegion = makeRegion(
      getRegionName(text).rname,
      getCoreCount(text).coreCount,
      getGleasonScore(text).gleason,
      getMaxInvolvement(text).involvement,
      getFeatures(text).ece,
      getFeatures(text).svi
    );
  }
  // console.log(JSON.stringify(newRegion));
  return newRegion;
};

var getFeatures = function (text) {
  var features;
  if (
    /extraprostatic extension/.test(text) ||
    /extracapsular exten/.test(text)
  ) {
    features = { ece: true };
  } else {
    features = { ece: false };
  }
  features.svi = /seminal vesicle invasion/.test(text);
  return { ...features, err: null };
};

var getCoreCount = function (text) {
  if (/adenocarcinoma/.test(text.toLowerCase())) {
    return { coreCount: [1, 1], err: null };
  }
  return { coreCount: [0, 1], err: null };
};

var getGleasonScore = function (text) {
  const matcher = new RegExp(/gleason.{1,10}([0-5]) ?\+ ?([0-5])/);
  if (matcher.test(text)) {
    var scoreMatch = text.match(matcher);
    return { gleason: [Number(scoreMatch[1]), Number(scoreMatch[2])], err: null};
  }
  return { gleason: [0, 0], err: null}
};

var getRegionName = function (text) {
  var low_text = text.toLowerCase();
  if (/left/.test(low_text)) {
    return { rname: "left", err: null };
  } else if (/right/.test(low_text)) {
    return { rname: "right", err: null };
  } else if (/mri/.test(low_text)) {
    if (low_text.match(/#([0-9]+)/)) {
      var m = low_text.match(/#([0-9]+)/);
      return { rname: `MRI target #${m[1]}`, err: null };
    }
  }
  return {
    region: null,
    err: new Error(`Could not identify region in text '${low_text}'`),
  };
};

var getMaxInvolvement = function (text) {
  const matcher = new RegExp(/[<|>]? ?([0-9]{1,3}) ?%/);
  if (matcher.test(text)) {
    const match = text.match(matcher);
    return { involvement: Number(match[1]), err: null };
  }
  return { involvement: 0, err: null };
};

const printSummary = function (workingRegions) {
   console.log(JSON.stringify(workingRegions));
};

var parseBiopsy = function (rawtext) {
  var lines = rawtext.split('\n');

  var regions = {};

  var l = [];
  var next_l = null;

  var first_line_finder = /^\s*([A-Z]\)\s+.*)$/;
  startwhile: while (lines.length > 0) {
    l = [lines.shift()];
    next_l = null;
    if (first_line_finder.test(l[0])) {
      // Starting a new section
      while (next_l === null) {
        next_l = lines.shift();
        if ( ( first_line_finder.test(next_l))  || (/^\S*$/.test(next_l)) ) {
          // we are starting a new section, put it back
          regions = addNewRegion(getRegion(l.join(' ').toLowerCase()), regions);
          // console.log(JSON.stringify(regions) + "\n\n\n");
          if ( first_line_finder.test(next_l)) {
            lines.unshift(next_l);
          }
          continue startwhile;
          // continue here;
        } else {
          l.push(next_l);
          next_l = null;
        }
      }
      regions = addNewRegion(getRegion(l.join(' ').toLowerCase()), regions);
      // console.log(JSON.stringify(regions) + "\n\n\n");
    }
  }
  regions = addNewRegion(getRegion(l.join(' ').toLowerCase()), regions);
  // console.log(JSON.stringify(regions));
  return { summary: printSummary(regions), regions: regions };
};

parseBiopsy(rawtext);

