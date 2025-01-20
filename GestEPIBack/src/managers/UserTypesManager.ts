import { userTypeModel } from "../models/userTypeModel";
import { UserType } from "../../../Types";

export const getAllUserTypes = async (): Promise<UserType[]> => {
  const userTypes = await userTypeModel.getAll();
  if (!userTypes || userTypes.length === 0) {
    throw new Error("Aucun type d'utilisateur trouvé.");
  }
  return userTypes;
};

export const getUserTypeById = async (id: number): Promise<UserType> => {
  const userType = await userTypeModel.getById(id);
  if (!userType) {
    throw new Error(`Aucun type d'utilisateur trouvé avec l'ID ${id}.`);
  }
  return userType;
};

export const addNewUserType = async (
  userType: UserType
): Promise<{ id: number }> => {
  if (!userType.type) {
    throw new Error("Le champ 'type' est obligatoire.");
  }

  const { insertId } = await userTypeModel.addOne(userType);
  return { id: insertId };
};

export const updateUserType = async (
  userType: UserType
): Promise<{ message: string }> => {
  if (!userType.id) {
    throw new Error("L'ID est obligatoire pour la mise à jour.");
  }

  const result = await userTypeModel.update(userType);
  if (result.affectedRows === 0) {
    throw new Error(
      `Aucun type d'utilisateur mis à jour. ID ${userType.id} non trouvé.`
    );
  }
  return { message: `Type d'utilisateur avec ID ${userType.id} mis à jour.` };
};

export const deleteUserType = async (
  id: number
): Promise<{ message: string }> => {
  const result = await userTypeModel.delete(id);
  if (result.affectedRows === 0) {
    throw new Error(`Aucun type d'utilisateur supprimé. ID ${id} non trouvé.`);
  }
  return { message: `Type d'utilisateur avec ID ${id} supprimé.` };
};
