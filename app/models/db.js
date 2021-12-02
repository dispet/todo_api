const mysql = require("mysql2");
const dbConfig = require("../config/db.config.js");


const connection = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB,
    port: 3306,
    insecureAuth : true
  });

  //здесь ничего такого не происходит, просто создаем подключение
  connection.connect(error => {
    if (error) throw error;
    console.log("Соединение с базой данных успешно установлено");
  });


  module.exports = connection;
