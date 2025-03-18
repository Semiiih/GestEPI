import { pool } from "./bdd";
import { Epi } from "../../../Types";

export const epiModel = {
  getAll: async (
    filterParams?: Record<string, string | number>
  ): Promise<Epi[]> => {
    let connection;
    try {
      connection = await pool.getConnection();
      let query = "SELECT * FROM epi";
      const values: (string | number)[] = [];
      const conditions: string[] = [];

      if (filterParams) {
        Object.entries(filterParams).forEach(([key, value]) => {
          conditions.push(`${key} = ?`);
          values.push(value);
        });
      }

      if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
      }

      const rows = await connection.query(query, values);
      return rows as Epi[];
    } catch (error) {
      console.error("Erreur dans epiModel.getAll :", error);
      throw new Error("Erreur lors de la récupération des EPI.");
    } finally {
      if (connection) connection.release();
    }
  },

  getById: async (id: number): Promise<Epi | null> => {
    let connection;
    try {
      connection = await pool.getConnection();
      const query = "SELECT * FROM epi WHERE id = ?";

      const rows = await connection.query(query, [id]);
      const result = Array.isArray(rows) ? rows : [rows];

      return result.length > 0 ? (result[0] as Epi) : null;
    } catch (error) {
      console.error("Erreur dans epiModel.getById :", error);
      throw new Error("Erreur lors de la récupération de l'EPI.");
    } finally {
      if (connection) connection.release();
    }
  },

  addOne: async (epi: Epi): Promise<{ insertId: number }> => {
    let connection;
    try {
      connection = await pool.getConnection();
      const query = `
        INSERT INTO epi (
          identifiant_personnalise, 
          marque, 
          modèle, 
          numéro_série, 
          taille, 
          couleur, 
          date_achat, 
          date_fabrication, 
          date_mise_service, 
          type_id, 
          périodicité_contrôle
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [
        epi.identifiant_personnalise,
        epi.marque,
        epi.modèle,
        epi.numéro_série,
        epi.taille,
        epi.couleur,
        epi.date_achat,
        epi.date_fabrication,
        epi.date_mise_service,
        epi.type_id,
        epi.périodicité_contrôle,
      ];

      const result = await connection.query(query, values);
      return { insertId: result.insertId };
    } catch (error) {
      console.error("Erreur dans epiModel.addOne :", error);
      throw new Error("Erreur lors de l'ajout d'un nouvel EPI.");
    } finally {
      if (connection) connection.release();
    }
  },

  update: async (epi: Epi): Promise<{ affectedRows: number }> => {
    let connection;
    try {
      connection = await pool.getConnection();
      const query = `
        UPDATE epi 
        SET identifiant_personnalise = ?, marque = ?, modèle = ?, numéro_série = ?, 
            taille = ?, couleur = ?, date_achat = ?, date_fabrication = ?, 
            date_mise_service = ?, type_id = ?, périodicité_contrôle = ?
        WHERE id = ?
      `;
      const values = [
        epi.identifiant_personnalise,
        epi.marque,
        epi.modèle,
        epi.numéro_série,
        epi.taille,
        epi.couleur,
        epi.date_achat,
        epi.date_fabrication,
        epi.date_mise_service,
        epi.type_id,
        epi.périodicité_contrôle,
        epi.id,
      ];

      const result = await connection.query(query, values);
      return { affectedRows: result.affectedRows };
    } catch (error) {
      console.error("Erreur dans epiModel.update :", error);
      throw new Error("Erreur lors de la mise à jour de l'EPI.");
    } finally {
      if (connection) connection.release();
    }
  },

  delete: async (id: number): Promise<{ affectedRows: number }> => {
    let connection;
    try {
      connection = await pool.getConnection();
      const query = "DELETE FROM epi WHERE id = ?";
      const result = await connection.query(query, [id]);
      return { affectedRows: result.affectedRows };
    } catch (error) {
      console.error("Erreur dans epiModel.delete :", error);
      throw new Error("Erreur lors de la suppression de l'EPI.");
    } finally {
      if (connection) connection.release();
    }
  },
};
