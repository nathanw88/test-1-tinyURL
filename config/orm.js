const connection = require("../config/connection.js");
//to be used with an array using the length method to get number of placeholders for esacping any reserved characters to protect against sql injection to be used with data to be placed in rows
function printSingleQuestionMarks(num) {
  var arr = [];
  for (var i = 0; i < num; i++) {
    arr.push("?");
  }
  return arr.toString();
}
//to be used with an array using the length method to get number of placeholders for esacping any reserved characters to protect against sql injection to be used with data that is a table or column names
function printDoubleQuestionMarks(num) {
  var arr = [];

  for (var i = 0; i < num; i++) {
    arr.push("??");
  }
  return arr.toString();
}

var orm = {

  create: function (table, cols, vals, cb) {
    var queryString = `INSERT INTO ?? (${printDoubleQuestionMarks(cols.length)}) VALUES (${printSingleQuestionMarks(vals.length)})`;
    connection.query(queryString, [table, ...cols, ...vals], function (err, result) {
      if (err) throw err;
      cb(result);
    });
  },

  selectWhere: function (table, searchCol, val, cb) {
    var queryString = "SELECT * FROM ?? WHERE ?? = ?;";
    connection.query(queryString, [table, searchCol, val], function (err, result) {
      if (err) throw err;
      cb(result);
    });
  }
};

module.exports = orm;