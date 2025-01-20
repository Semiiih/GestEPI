import { pool } from "./bdd";
import { CheckStatus } from "../../../Types";

export const checkStatusModel = {
  getAll: async (): Promise<CheckStatus[]> => {
    let connection;
    try {
      connection = await pool.getConnection();
      const query = "SELECT * FROM checkStatus";

      const rows = await connection.query(query);
      return Array.isArray(rows)
        ? (rows as CheckStatus[])
        : [rows as CheckStatus];
    } catch (error) {
      console.error("Erreur dans checkStatusModel.getAll :", error);
      throw new Error(
        "Erreur lors de la récupération des statuts de contrôle."
      );
    } finally {
      if (connection) connection.release();
    }
  },

  getById: async (id: number): Promise<CheckStatus | null> => {
    let connection;
    try {
      connection = await pool.getConnection();
      const query = "SELECT * FROM checkStatus WHERE id = ?";

      const rows = await connection.query(query, [id]);
      const result = Array.isArray(rows) ? rows : [rows];
      return result.length > 0 ? (result[0] as CheckStatus) : null;
    } catch (error) {
      console.error("Erreur dans checkStatusModel.getById :", error);
      throw new Error("Erreur lors de la récupération du statut de contrôle.");
    } finally {
      if (connection) connection.release();
    }
  },

  addOne: async (checkStatus: CheckStatus): Promise<{ insertId: number }> => {
    let connection;
    try {
      connection = await pool.getConnection();
      const query = "INSERT INTO checkStatus (status) VALUES (?)";
      const result = await connection.query(query, [checkStatus.status]);
      return { insertId: result.insertId };
    } catch (error) {
      console.error("Erreur dans checkStatusModel.addOne :", error);
      throw new Error("Erreur lors de l'ajout du statut de contrôle.");
    } finally {
      if (connection) connection.release();
    }
  },

  update: async (
    checkStatus: CheckStatus
  ): Promise<{ affectedRows: number }> => {
    let connection;
    try {
      connection = await pool.getConnection();
      const query = "UPDATE checkStatus SET status = ? WHERE id = ?";
      const result = await connection.query(query, [
        checkStatus.status,
        checkStatus.id,
      ]);
      return { affectedRows: result.affectedRows };
    } catch (error) {
      console.error("Erreur dans checkStatusModel.update :", error);
      throw new Error("Erreur lors de la mise à jour du statut de contrôle.");
    } finally {
      if (connection) connection.release();
    }
  },

  delete: async (id: number): Promise<{ affectedRows: number }> => {
    let connection;
    try {
      connection = await pool.getConnection();
      const query = "DELETE FROM checkStatus WHERE id = ?";
      const result = await connection.query(query, [id]);
      return { affectedRows: result.affectedRows };
    } catch (error) {
      console.error("Erreur dans checkStatusModel.delete :", error);
      throw new Error("Erreur lors de la suppression du statut de contrôle.");
    } finally {
      if (connection) connection.release();
    }
  },
};
