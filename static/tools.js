// Work in progress
const make_markdown_table = () => {
  function columnWidth(rows, columnIndex) {
    return Math.max.apply(
      null,
      rows.map(function (row) {
        return ("" + row[columnIndex]).length;
      })
    );
  }

  function looksLikeTable(data) {
    return true;
  }

  var data = document.getElementById("tableinput").value;

  var rows = data.split("\n").map(function (row) {
    row = row.replace("\n", " ");
    return row.split("\t");
  });

  var colAlignments = [];

  var columnWidths = rows[0].map(function (column, columnIndex) {
    var alignment = "l";
    var re = /^(\^[lcr])/i;
    var m = column.match(re);
    if (m) {
      var align = m[1][1].toLowerCase();
      if (align === "c") {
        alignment = "c";
      } else if (align === "r") {
        alignment = "r";
      }
    }
    colAlignments.push(alignment);
    column = column.replace(re, "");
    rows[0][columnIndex] = column;
    return columnWidth(rows, columnIndex);
  });
  var markdownRows = rows.map(function (row, _rowIndex) {
    // | Name         | Title | Email Address  |
    // |--------------|-------|----------------|
    // | Jane Atler   | CEO   | jane@acme.com  |
    // | John Doherty | CTO   | john@acme.com  |
    // | Sally Smith  | CFO   | sally@acme.com |
    return (
      "| " +
      row
        .map(function (column, index) {
          return (
            column + Array(columnWidths[index] - column.length + 1).join(" ")
          );
        })
        .join(" | ") +
      " |"
    );
  });

  markdownRows.splice(
    1,
    0,
    "|" +
      columnWidths
        .map(function (_width, index) {
          var prefix = "";
          var postfix = "";
          var adjust = 0;
          var alignment = colAlignments[index];
          if (alignment === "r") {
            postfix = ":";
            adjust = 1;
          } else if (alignment == "c") {
            prefix = ":";
            postfix = ":";
            adjust = 2;
          }
          return (
            prefix + Array(columnWidths[index] + 3 - adjust).join("-") + postfix
          );
        })
        .join("|") +
      "|"
  );

  var output = markdownRows.join("\n");
  console.log(output);

  document.getElementById("tableoutput").value = output;
  return;
};
