/**
 * @class       : parseBiopsy
 * @author      : David M. Rosenberg (dmr@davidrosenberg.me)
 * @created     : Sunday Aug 08, 2021 09:46:48 CDT
 * @description : parseBiopsy
 */

export default class parseBiopsy {
}

const makeRegion = function(name="", cores=[0, 0] gleason=[0,0], max_involvement=0, ece=false, svi=false) {
  var region = {
    rname: name,
    cores: [0, 0],
    gleason: gleason,
    max_involvement: percent,
    ece: ece,
    svi: svi
  }
}

const addNewRegion = function(newRegion, workingRegions) {
  if 

const getRegion = function(text) {
  const newRegion = makeRegion(
    rname=getRegionName(text).region,
    cores=getCoreCount(text).coreCount,
    gleason=getGleasonScore(text).gleason,
    max_involvement=getMaxInvolvement(text).involvement,
    ece=getFeatures(text).ece,
    svi=getFeatures(text).svi
  );
  return newRegion;
}


const getRegionName = function(text) {
  var low_text = text.toLowerCase();
  if (/left/.test(low_text)) {
    return {region: 'left', err: null};
  } else if (/right/.test(low_text) ) {
    return {region: 'right', err: null};
  } else if (/mri/.test(low_text) ) {
    if ( low_text.match(/#([0-9]+)/ )) {
      const m = low_text.match(/#([0-9]+)/);
      return {region: `MRI target #${m[1]}`, err: null};
    }
  }
  return {region: null, err: new Error(`Could not identify region in text '${low_text}'`) }
}

const getGleasonScore = function(text) {
  return {primary: 0, secondary: 0, err: null}
}

const getMaxInvolvement = function(text) {
  return {involvement: 0, err: null}
}



const parseBiopsy = (rawtext) => {
  const lines = rawtext.split('\n').map( (x) => {
    x.replace('\n', '');
  });
  var regions = {}

  var l;
  var next_l = null;

  var first_line_finder = /^\s*([A-Z]\)\s+.*)$/;
  while (lines.length > 0) {
    l = lines.shift();
    if(first_line_finder.test(l)) {
      // Starting a new section
      while ( next_l === null ) {
        next_l = lines.shift();
        if ( (first_line_finder.test(next_l)) || (next_l === "" ) ) {
          // we are starting a new section, put it back
          lines.unshift(next_l)
        } else if ( /igned/.test(next_l) ) {
          // we're done.  Get out
          regions = addNewRegion(getRegion(lines));
          return printSummary(regions);
        } else {
          l = `${l} ${next_l}`
          next_l = null;
        }
      }
      regions = addNewRegion(getRegion(lines));
    }
  }
  return printSummary(regions);
}









