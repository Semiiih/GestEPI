import { pool } from "./bdd";
import { UserType } from "../../../Types";

export const userTypeModel = {
  getAll: async (): Promise<UserType[]> => {
    let connection;
    try {
      connection = await pool.getConnection();
      const query = "SELECT * FROM usersTypes";

      const rows = await connection.query(query);
      return Array.isArray(rows) ? (rows as UserType[]) : [rows as UserType];
    } catch (error) {
      console.error("Erreur dans userTypeModel.getAll :", error);
      throw new Error(
        "Erreur lors de la récupération des types d'utilisateur."
      );
    } finally {
      if (connection) connection.release();
    }
  },

  getById: async (id: number): Promise<UserType | null> => {
    let connection;
    try {
      connection = await pool.getConnection();
      const query = "SELECT * FROM usersTypes WHERE id = ?";

      const rows = await connection.query(query, [id]);
      const result = Array.isArray(rows) ? rows : [rows];
      return result.length > 0 ? (result[0] as UserType) : null;
    } catch (error) {
      console.error("Erreur dans userTypeModel.getById :", error);
      throw new Error("Erreur lors de la récupération du type d'utilisateur.");
    } finally {
      if (connection) connection.release();
    }
  },

  addOne: async (userType: UserType): Promise<{ insertId: number }> => {
    let connection;
    try {
      connection = await pool.getConnection();
      const query = "INSERT INTO usersTypes (type) VALUES (?)";
      const result = await connection.query(query, [userType.type]);
      return { insertId: result.insertId };
    } catch (error) {
      console.error("Erreur dans userTypeModel.addOne :", error);
      throw new Error("Erreur lors de l'ajout du type d'utilisateur.");
    } finally {
      if (connection) connection.release();
    }
  },

  update: async (userType: UserType): Promise<{ affectedRows: number }> => {
    let connection;
    try {
      connection = await pool.getConnection();
      const query = "UPDATE usersTypes SET type = ? WHERE id = ?";
      const result = await connection.query(query, [
        userType.type,
        userType.id,
      ]);
      return { affectedRows: result.affectedRows };
    } catch (error) {
      console.error("Erreur dans userTypeModel.update :", error);
      throw new Error("Erreur lors de la mise à jour du type d'utilisateur.");
    } finally {
      if (connection) connection.release();
    }
  },

  delete: async (id: number): Promise<{ affectedRows: number }> => {
    let connection;
    try {
      connection = await pool.getConnection();
      const query = "DELETE FROM usersTypes WHERE id = ?";
      const result = await connection.query(query, [id]);
      return { affectedRows: result.affectedRows };
    } catch (error) {
      console.error("Erreur dans userTypeModel.delete :", error);
      throw new Error("Erreur lors de la suppression du type d'utilisateur.");
    } finally {
      if (connection) connection.release();
    }
  },
};
