require('dotenv').config();
const mysql = require("mysql");

const BDDSQL = mysql.createConnection({
  host: process.env.MYSQL_ADDON_HOST_TEST,
  database: process.env.MYSQL_ADDON_DB_TEST,
  user: process.env.MYSQL_ADDON_USER_TEST,
  password: process.env.MYSQL_ADDON_PASSWORD_TEST
});

module.exports = {
  BDDSQL: BDDSQL
};
