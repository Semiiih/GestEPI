import { pool } from "./bdd";
import { EpiType } from "../../../Types";

export const epiTypeModel = {
  getAll: async (): Promise<EpiType[]> => {
    let connection;
    try {
      connection = await pool.getConnection();
      const rows = await connection.query("SELECT * FROM epiTypes");
      return rows as EpiType[];
    } catch (error) {
      throw new Error("Erreur lors de la récupération des types d'EPI.");
    } finally {
      if (connection) connection.release();
    }
  },

  getById: async (id: number): Promise<EpiType | null> => {
    let connection;
    try {
      connection = await pool.getConnection();
      const rows = await connection.query(
        "SELECT * FROM epiTypes WHERE id = ?",
        [id]
      );
      return rows.length > 0 ? (rows[0] as EpiType) : null;
    } catch (error) {
      throw new Error("Erreur lors de la récupération du type d'EPI.");
    } finally {
      if (connection) connection.release();
    }
  },

  addOne: async (epiType: EpiType): Promise<{ insertId: number }> => {
    let connection;
    try {
      connection = await pool.getConnection();
      const result = await connection.query(
        `INSERT INTO epiTypes (type) VALUES (?)`,
        [epiType.type]
      );
      return { insertId: result.insertId };
    } catch (error) {
      throw new Error("Erreur lors de l'ajout du type d'EPI.");
    } finally {
      if (connection) connection.release();
    }
  },

  update: async (epiType: EpiType): Promise<{ affectedRows: number }> => {
    let connection;
    try {
      connection = await pool.getConnection();
      const result = await connection.query(
        `UPDATE epiTypes SET type = ? WHERE id = ?`,
        [epiType.type, epiType.id]
      );
      return { affectedRows: result.affectedRows };
    } catch (error) {
      throw new Error("Erreur lors de la mise à jour du type d'EPI.");
    } finally {
      if (connection) connection.release();
    }
  },

  delete: async (id: number): Promise<{ affectedRows: number }> => {
    let connection;
    try {
      connection = await pool.getConnection();
      const result = await connection.query(
        `DELETE FROM epiTypes WHERE id = ?`,
        [id]
      );
      return { affectedRows: result.affectedRows };
    } catch (error) {
      throw new Error("Erreur lors de la suppression du type d'EPI.");
    } finally {
      if (connection) connection.release();
    }
  },
};
