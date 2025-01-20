//********** Imports **********/
import { pool } from "./bdd";
import { EpiCheck } from "../../../Types";

//********** Model **********//
export const epiCheckModel = {
  getAll: async (): Promise<EpiCheck[]> => {
    let connection;
    try {
      connection = await pool.getConnection();
      const query = "SELECT * FROM epiCheck";

      const rows = await connection.query(query);

      const result = Array.isArray(rows) ? rows : [rows];

      return result as EpiCheck[];
    } catch (error) {
      console.error("Erreur dans epiCheckModel.getAll :", error);
      throw new Error("Erreur lors de la récupération des contrôles d'EPI.");
    } finally {
      if (connection) connection.release();
    }
  },

  getById: async (id: number): Promise<EpiCheck | null> => {
    let connection;
    try {
      connection = await pool.getConnection();
      const query = "SELECT * FROM epiCheck WHERE id = ?";

      const rows = await connection.query(query, [id]);

      const result = Array.isArray(rows) ? rows : [rows];

      return result.length > 0 ? (result[0] as EpiCheck) : null;
    } catch (error) {
      console.error("Erreur dans epiCheckModel.getById :", error);
      throw new Error("Erreur lors de la récupération du contrôle d'EPI.");
    } finally {
      if (connection) connection.release();
    }
  },

  addOne: async (epiCheck: EpiCheck): Promise<{ insertId: number }> => {
    let connection;
    try {
      connection = await pool.getConnection();

      const query = `
        INSERT INTO epiCheck (date_contrôle, gestionnaire_id, epi_id, status_id, remarques)
        VALUES (?, ?, ?, ?, ?)
      `;
      const values = [
        epiCheck.date_contrôle,
        epiCheck.gestionnaire_id,
        epiCheck.epi_id,
        epiCheck.status_id,
        epiCheck.remarques,
      ];

      console.log("Requête SQL exécutée :", query, "avec valeurs :", values);

      const result = await connection.query(query, values);

      return { insertId: result.insertId };
    } catch (error) {
      console.error("Erreur dans epiCheckModel.addOne :", error);
      throw new Error("Erreur lors de l'ajout du contrôle d'EPI.");
    } finally {
      if (connection) connection.release();
    }
  },

  update: async (epiCheck: EpiCheck) => {
    let connection;
    try {
      connection = await pool.getConnection();
      const rows = await connection.query(
        `UPDATE EpiCheck SET epiId = ?, date = ? WHERE id = ?`,
        [epiCheck.epi_id, epiCheck.date_contrôle, epiCheck.id]
      );
      return rows;
    } catch (error) {
      throw new Error("Erreur lors de la mise à jour du contrôle d'EPI.");
    } finally {
      if (connection) connection.release();
    }
  },

  delete: async (id: number): Promise<{ affectedRows: number }> => {
    let connection;
    try {
      console.log("Requête SQL pour supprimer :", id);
      connection = await pool.getConnection();

      const query = `DELETE FROM epiCheck WHERE id = ?`;
      console.log("Requête SQL exécutée :", query, "avec id :", id);

      const result = await connection.query(query, [id]);

      return { affectedRows: result.affectedRows || 0 };
    } catch (error) {
      console.error("Erreur dans epiCheckModel.delete :", error);
      throw new Error("Erreur lors de la suppression du contrôle d'EPI.");
    } finally {
      if (connection) connection.release();
    }
  },
};
