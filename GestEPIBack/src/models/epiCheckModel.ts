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

      // Convertir la date en format MySQL (YYYY-MM-DD)
      const formattedDate = epiCheck.date_contrôle
        ? new Date(epiCheck.date_contrôle).toISOString().split("T")[0]
        : null;

      const query = `
        UPDATE epiCheck 
        SET 
          date_contrôle = ?, 
          gestionnaire_id = ?, 
          epi_id = ?, 
          status_id = ?, 
          remarques = ? 
        WHERE id = ?
      `;
      const values = [
        formattedDate,
        epiCheck.gestionnaire_id,
        epiCheck.epi_id,
        epiCheck.status_id,
        epiCheck.remarques,
        epiCheck.id,
      ];

      const result = await connection.query(query, values);

      return { affectedRows: result.affectedRows || 0 };
    } catch (error) {
      console.error(
        "Erreur détaillée lors de la mise à jour du contrôle d'EPI :",
        error
      );
      throw error;
    } finally {
      if (connection) connection.release();
    }
  },

  delete: async (id: number): Promise<{ affectedRows: number }> => {
    let connection;
    try {
      connection = await pool.getConnection();

      const query = `DELETE FROM epiCheck WHERE id = ?`;

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
