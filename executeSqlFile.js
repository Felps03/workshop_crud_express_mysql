const fs = require("fs");
const mysql = require("mysql2");
const path = require("path");

// Cria a conexão com o MySQL
const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "example",
  database: "node_mysql_login",
  multipleStatements: true
});

connection.connect((err) => {
  if (err) {
    return console.error("Erro ao conectar: " + err.message);
  }
  console.log("Conectado ao servidor MySQL.");

  const sqlFilePath = path.join(__dirname, "database_setup.sql");

  fs.readFile(sqlFilePath, { encoding: "utf-8" }, (err, sqlContent) => {
    if (err) {
      console.error("Erro ao ler o arquivo:", err);
      return;
    }

    connection.query(sqlContent, (err, results) => {
      if (err) {
        console.error("Erro ao executar instruções SQL:", err);
        return;
      }
      console.log("Instruções SQL executadas com sucesso.");

      connection.end((err) => {
        if (err) {
          console.error("Erro ao fechar a conexão:", err.message);
          return;
        }
        console.log("Conexão fechada com sucesso.");
      });
    });
  });
});
