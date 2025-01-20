import { userModel } from "../models/userModel";
import { User } from "../../../Types";

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const users = await userModel.getAll();
    if (!users || users.length === 0) {
      throw new Error("Aucun utilisateur trouvé.");
    }
    return users;
  } catch (error) {
    console.error("Erreur dans getAllUsers :", error);
    throw new Error(
      `Erreur lors de la récupération des utilisateurs : ${
        error instanceof Error ? error.message : "Erreur inconnue"
      }`
    );
  }
};

export const getUserById = async (id: number): Promise<User | null> => {
  try {
    const user = await userModel.getById(id);
    if (!user) {
      throw new Error(`Aucun utilisateur trouvé avec l'ID ${id}.`);
    }
    return user;
  } catch (error) {
    throw new Error(
      `Erreur lors de la récupération de l'utilisateur : ${
        error instanceof Error ? error.message : "Erreur inconnue"
      }`
    );
  }
};

export const addNewUser = async (user: User): Promise<{ id: number }> => {
  try {
    if (!user.nom || !user.email || !user.user_type_id) {
      throw new Error(
        "Les champs 'nom', 'email' et 'user_type_id' sont obligatoires."
      );
    }

    const result = await userModel.addOne(user);
    return { id: result.insertId };
  } catch (error) {
    throw new Error(
      `Erreur lors de l'ajout de l'utilisateur : ${
        error instanceof Error ? error.message : "Erreur inconnue"
      }`
    );
  }
};

export const updateUser = async (user: User) => {
  try {
    if (!user.id) {
      throw new Error("L'ID est obligatoire pour la mise à jour.");
    }
    const result = await userModel.update(user);
    if (result.affectedRows === 0) {
      throw new Error(
        `Aucun utilisateur mis à jour. ID ${user.id} non trouvé.`
      );
    }
    return { message: `Utilisateur avec ID ${user.id} mis à jour.` };
  } catch (error) {
    throw new Error(
      `Erreur lors de la mise à jour de l'utilisateur : ${
        error instanceof Error ? error.message : "Erreur inconnue"
      }`
    );
  }
};

export const deleteUser = async (id: number) => {
  try {
    const result = await userModel.delete(id);
    if (result.affectedRows === 0) {
      throw new Error(`Aucun utilisateur supprimé. ID ${id} non trouvé.`);
    }
    return { message: `Utilisateur avec ID ${id} supprimé.` };
  } catch (error) {
    throw new Error(
      `Erreur lors de la suppression de l'utilisateur : ${
        error instanceof Error ? error.message : "Erreur inconnue"
      }`
    );
  }
};
