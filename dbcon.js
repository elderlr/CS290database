//push the comments
var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs290_elderl',
  password        : '8593',
  database        : 'cs290_elderl'
});

module.exports.pool = pool;

healyg