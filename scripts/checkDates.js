
// interface EventDate {
//   year: Number,
//   month: Number | null,
//   day: Number | null,
//   srcline: Number,
// }

const EventDate = function(srcline, year, month, day) {
  if (typeof (srcline) === 'undefined') {
    throw Error('srcline required for EventDate')
  }
  var result = {
    year: undefined,
    month: undefined,
    day: undefined,
    srcline: srcline
  }
  if (year !== undefined) {
    result.year = year;
  }
  if (month !== undefined) {
    result.month = month;
  }
  if (day !== undefined) {
    result.day = day;
  }
  return result;
}

const DATE_MATCHER = new RegExp(/^(\d{1,2}\/)?(\d{1,2}\/)?([0-9]{2,4}):?\W+.*$/);
var current_line = 0;

var getDateObj = function(textline) {
  const m = textline.match(DATE_MATCHER);
  var eDate = {
    year: Number(m[3]),
    month: null,
    day: null,
    srcline: current_line
  }
  current_line += 1;
  if (m[1] !== undefined) {
    eDate.day = Number(m[1]);
  }
  if (m[2] !== undefined) {
    eDate.month = Number(m[2]);
  }
  return eDate;
}
