import { epiTypeModel } from "../models/epiTypeModel";
import { EpiType } from "../../../Types";

export const getAllEpiTypes = async (): Promise<EpiType[]> => {
  const epiTypes = await epiTypeModel.getAll();
  if (!epiTypes || epiTypes.length === 0) {
    throw new Error("Aucun type d'EPI trouvé.");
  }
  return epiTypes;
};

export const getEpiTypeById = async (id: number): Promise<EpiType> => {
  const epiType = await epiTypeModel.getById(id);
  if (!epiType) {
    throw new Error(`Aucun type d'EPI trouvé avec l'ID ${id}.`);
  }
  return epiType;
};

export const addNewEpiType = async (
  epiType: EpiType
): Promise<{ id: number }> => {
  if (!epiType.type) {
    throw new Error("Le champ 'type' est obligatoire.");
  }

  const { insertId } = await epiTypeModel.addOne(epiType);
  return { id: insertId };
};

export const updateEpiType = async (
  epiType: EpiType
): Promise<{ message: string }> => {
  if (!epiType.id) {
    throw new Error("L'ID est obligatoire pour la mise à jour.");
  }

  const result = await epiTypeModel.update(epiType);
  if (result.affectedRows === 0) {
    throw new Error(
      `Aucun type d'EPI mis à jour. ID ${epiType.id} non trouvé.`
    );
  }
  return { message: `Type d'EPI avec ID ${epiType.id} mis à jour.` };
};

export const deleteEpiType = async (
  id: number
): Promise<{ message: string }> => {
  const result = await epiTypeModel.delete(id);
  if (result.affectedRows === 0) {
    throw new Error(`Aucun type d'EPI supprimé. ID ${id} non trouvé.`);
  }
  return { message: `Type d'EPI avec ID ${id} supprimé.` };
};
