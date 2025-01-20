import { pool } from "./bdd";
import { User } from "../../../Types";

export const userModel = {
  getAll: async (): Promise<User[]> => {
    let connection;
    try {
      connection = await pool.getConnection();
      const rows = await connection.query("SELECT * FROM users");
      return rows as User[];
    } catch (error) {
      throw new Error("Erreur lors de la récupération des utilisateurs.");
    } finally {
      if (connection) connection.release();
    }
  },

  getById: async (id: number): Promise<User | null> => {
    let connection;
    try {
      connection = await pool.getConnection();
      const rows = await connection.query("SELECT * FROM users WHERE id = ?", [
        id,
      ]);
      return rows.length > 0 ? (rows[0] as User) : null;
    } catch (error) {
      throw new Error("Erreur lors de la récupération de l'utilisateur.");
    } finally {
      if (connection) connection.release();
    }
  },

  addOne: async (user: User): Promise<{ insertId: number }> => {
    let connection;
    try {
      connection = await pool.getConnection();
      const result = await connection.query(
        `INSERT INTO users (nom, email, user_type_id) VALUES (?, ?, ?)`,
        [user.nom, user.email, user.user_type_id]
      );
      return { insertId: result.insertId };
    } catch (error) {
      throw new Error("Erreur lors de l'ajout de l'utilisateur.");
    } finally {
      if (connection) connection.release();
    }
  },

  update: async (user: User): Promise<{ affectedRows: number }> => {
    let connection;
    try {
      connection = await pool.getConnection();
      const result = await connection.query(
        `UPDATE users SET nom = ?, email = ?, user_type_id = ? WHERE id = ?`,
        [user.nom, user.email, user.user_type_id, user.id]
      );
      return { affectedRows: result.affectedRows };
    } catch (error) {
      throw new Error("Erreur lors de la mise à jour de l'utilisateur.");
    } finally {
      if (connection) connection.release();
    }
  },

  delete: async (id: number): Promise<{ affectedRows: number }> => {
    let connection;
    try {
      connection = await pool.getConnection();
      const result = await connection.query("DELETE FROM users WHERE id = ?", [
        id,
      ]);
      return { affectedRows: result.affectedRows };
    } catch (error) {
      throw new Error("Erreur lors de la suppression de l'utilisateur.");
    } finally {
      if (connection) connection.release();
    }
  },
};
