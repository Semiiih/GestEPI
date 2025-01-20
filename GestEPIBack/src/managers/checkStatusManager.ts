import { checkStatusModel } from "../models/checkStatusModel";
import { CheckStatus } from "../../../Types";

export const getAllCheckStatuses = async (): Promise<CheckStatus[]> => {
  const statuses = await checkStatusModel.getAll();
  if (!statuses || statuses.length === 0) {
    throw new Error("Aucun statut de contrôle trouvé.");
  }
  return statuses;
};

export const getCheckStatusById = async (id: number): Promise<CheckStatus> => {
  const status = await checkStatusModel.getById(id);
  if (!status) {
    throw new Error(`Aucun statut de contrôle trouvé avec l'ID ${id}.`);
  }
  return status;
};

export const addNewCheckStatus = async (
  status: CheckStatus
): Promise<{ id: number }> => {
  if (!status.status) {
    throw new Error("Le champ 'status' est obligatoire.");
  }

  const { insertId } = await checkStatusModel.addOne(status);
  return { id: insertId };
};

export const updateCheckStatus = async (
  status: CheckStatus
): Promise<{ message: string }> => {
  if (!status.id) {
    throw new Error("L'ID est obligatoire pour la mise à jour.");
  }

  const result = await checkStatusModel.update(status);
  if (result.affectedRows === 0) {
    throw new Error(
      `Aucun statut de contrôle mis à jour. ID ${status.id} non trouvé.`
    );
  }
  return { message: `Statut de contrôle avec ID ${status.id} mis à jour.` };
};

export const deleteCheckStatus = async (
  id: number
): Promise<{ message: string }> => {
  const result = await checkStatusModel.delete(id);
  if (result.affectedRows === 0) {
    throw new Error(`Aucun statut de contrôle supprimé. ID ${id} non trouvé.`);
  }
  return { message: `Statut de contrôle avec ID ${id} supprimé.` };
};
