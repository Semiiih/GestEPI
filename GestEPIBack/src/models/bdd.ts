//********** Imports **********/
import mariadb from "mariadb";

//********** Pool **********/
export const pool = mariadb.createPool({
  host: "localhost",
  // port: 8080,
  user: "root",
  password: "root",
  database: "GestEPI",
  bigIntAsNumber: true,
  dateStrings: true,
  connectionLimit: 5,
});

pool
  .getConnection()
  .then((conn) => {
    console.log("Connexion réussie à la base de données");
    conn.release();
  })
  .catch((err) => {
    console.error("Erreur de connexion à la base de données", err);
  });
