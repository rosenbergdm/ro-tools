/**
 * @class       : parseBiopsy
 * @author      : David M. Rosenberg (dmr@davidrosenberg.me)
 * @created     : Sunday Aug 08, 2021 09:46:48 CDT
 * @description : parseBiopsy
 */

Object.assign(String.prototype, {
    toTitleCase () {
        return  this[0].toUpperCase() + this.substr(1) ;
    }
})

const stringMatchesOne = function(testString, matchList) {
  var matches = false;
  matchList.forEach( (x) => {
    matches = matches || !! testString.match(x);
  });
  return matches;
}

const makeRegion = function (
  rname = "",
  cores = [0, 1],
  gleason = [0, 0],
  involvement = 0,
  ece = false,
  svi = false,
  pni = false
) {
  let region = {
    rname: rname,
    cores: cores,
    gleason: gleason,
    involvement: involvement,
    ece: ece,
    svi: svi,
    pni: pni
  };
  return region;
};

const sumCores = function (c1, c2) {
  return [c1[0] + c2[0], c1[1] + c2[1]];
};

const higherGleason = function (g1, g2) {
  if (g1[0] + g1[1] >= g2[0] + g2[1] && g1[0] >= g2[0]) {
    return g1;
  } else if (g1[0] + g1[1] < g2[0] + g2[1]) {
    return g2;
  } else {
    return g1[0] > g2[0] ? g1 : g2;
  }
};

const addNewRegion = function (newRegion, workingRegions) {
  if (Object.keys(workingRegions).includes(newRegion.rname)) {
    const oldRegion = workingRegions[newRegion.rname];
    workingRegions[newRegion.rname] = {
      ...oldRegion,
      cores: sumCores(oldRegion.cores, newRegion.cores),
      gleason: higherGleason(oldRegion.gleason, newRegion.gleason),
      involvement: Math.max(oldRegion.involvement, newRegion.involvement),
      ece: oldRegion.ece || newRegion.ece,
      svi: oldRegion.svi || newRegion.svi,
      pni: oldRegion.pni || oldRegion.pni,
    };
  } else {
    workingRegions[newRegion.rname] = newRegion;
  }
  return workingRegions;
};

const getRegion = function (text) {
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
      getFeatures(text).svi,
      getFeatures(text).pni,
    );
  }
  return newRegion;
};

const getFeatures = function (text) {
  var features = { ece: false, svi: false, pni: false };
  if (
    /extraprostatic extension/.test(text) ||
    /extracapsular exten/.test(text)
  ) {
    features = {...features, ece: true };
  }
  if (/seminal vesicle invasion/.test(text)) {
    features = {...features, svi: true };
  }
  if (/erineural invas/.test(text)) {
    features = {...features, pni: true };
  }
  return features;
};

const getCoreCount = function (text) {
  if (/adenocarcinoma/.test(text.toLowerCase())) {
    return { coreCount: [1, 1], err: null };
  }
  return { coreCount: [0, 1], err: null };
};

const getGleasonScore = function (text) {
  const matcher = new RegExp(/gleason.{1,10}([0-5]) ?\+ ?([0-5])/);
  if (matcher.test(text)) {
    const scoreMatch = text.match(matcher);
    return {
      gleason: [Number(scoreMatch[1]), Number(scoreMatch[2])],
      err: null,
    };
  }
  return { gleason: [0, 0], err: null };
};

const getRegionName = function (text) {
  var low_text = text.toLowerCase();
  if (stringMatchesOne(low_text, ['left', ' l ', ' lft '])) {
    return { rname: "Left", err: null };
  } else if (/left/.test(low_text)) {
    return { rname: "Left", err: null };
  } else if (/right/.test(low_text)) {
    return { rname: "Right", err: null };
  } else if (/mri/.test(low_text) || /target/.test(low_text)) {
    if (low_text.match(/#? ?([0-9]+)/)) {
      const m = low_text.match(/#? ?([0-9]+)/);
      return { rname: `MRI target #${m[1]}`, err: null };
    }
  } else if (/ l /.test(low_text)) {
    return { rname: "Left", err: null };
  } else if (/ r /.test(low_text)) {
    return { rname: "Right", err: null };
  }
  return {
    rname: "?NAME?",
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

const printRegion = function (region) {
  var result = `${region.rname.toTitleCase}: ${region.cores[0]}/${region.cores[1]} areas positive for adenocarcinoma`;
  if (region.cores[0] == 0) {
    return result;
  } else {
    result = `${result}, maximum Gleason score ${region.gleason[0]} + ${
      region.gleason[1]
    } = ${region.gleason[0] + region.gleason[1]}, up to ${
      region.involvement
    }% involved`;
    if (region.ece) {
      result = `${result}, extracapsular extension seen`;
    }
    if (region.svi) {
      result = `${result}, seminal vesicle involvement seen`;
    }
    if (region.pni) {
      result = `${result}, perineural invasion seen`;
    }
  }
  return result;
};

const printSummary = function (workingRegions) {
  var resultLines = [];
  var maxGleason = [0, 0];
  var totalCores = [0, 0];
  var maxInvolvement = 0;
  var totalEce = false;
  var totalSvi = false;
  var totalPni = false;
  Object.keys(workingRegions).forEach((x) => {
    resultLines.push(printRegion(workingRegions[x]));
    maxGleason = higherGleason(maxGleason, workingRegions[x].gleason);
    totalCores = sumCores(totalCores, workingRegions[x].cores);
    maxInvolvement = Math.max(maxInvolvement, workingRegions[x].involvement);
    totalEce = totalEce || workingRegions[x].ece;
    totalSvi = totalSvi || workingRegions[x].svi;
    totalPni = totalPni || workingRegions[x].pni;
  });

  var result = resultLines.join("; ");
  result +=
    "; " +
    printRegion(
      makeRegion(
        "total",
        totalCores,
        maxGleason,
        maxInvolvement,
        totalEce,
        totalSvi,
        totalPni
      )
    );
  return result;
};

export const parseBiopsy = function (rawtext) {
  var lines = rawtext.split("\n");

  var regions = {};

  var l = [];
  var next_l = null;

  var first_line_finder = /^\s*([A-Z][\)|\.]\s+.*)$/;
  startwhile: while (lines.length > 0) {
    l = [lines.shift()];
    next_l = null;
    if (first_line_finder.test(l[0])) {
      // Starting a new section
      while (next_l === null) {
        next_l = lines.shift();
        if (first_line_finder.test(next_l) || /^\S*$/.test(next_l)) {
          // we are starting a new section, put it back
          regions = addNewRegion(getRegion(l.join(" ").toLowerCase()), regions);
          // console.log(JSON.stringify(regions) + "\n\n\n");
          if (first_line_finder.test(next_l)) {
            lines.unshift(next_l);
          }
          continue startwhile;
          // continue here;
        } else if (/electronically signed/.test(l.join("\n").toLowerCase())) {
          lines = [];
          continue startwhile;
        } else {
          l.push(next_l);
          next_l = null;
        }
      }
      regions = addNewRegion(getRegion(l.join(" ").toLowerCase()), regions);
      // console.log(JSON.stringify(regions) + "\n\n\n");
    }
  }
  // regions = addNewRegion(getRegion(l.join(" ").toLowerCase()), regions);
  // console.log(JSON.stringify(regions));
  return { summary: printSummary(regions), regions: regions };
};

export default  parseBiopsy;
