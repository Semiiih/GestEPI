//********** Imports **********/
import { epiCheckModel } from "../models/epiCheckModel";
import { EpiCheck } from "../../../Types";

//********** Manager **********/
export const getAllEpiChecks = async (): Promise<EpiCheck[]> => {
  try {
    const epiChecks = await epiCheckModel.getAll();
    if (!epiChecks || epiChecks.length === 0) {
      throw new Error("Aucun contrôle d'EPI trouvé.");
    }
    return epiChecks;
  } catch (error) {
    console.error("Erreur dans getAllEpiChecks :", error);
    throw new Error(
      `Erreur lors de la récupération des contrôles d'EPI : ${
        error instanceof Error ? error.message : "Erreur inconnue"
      }`
    );
  }
};

export const getEpiCheckById = async (id: number): Promise<EpiCheck | null> => {
  try {
    const epiCheck = await epiCheckModel.getById(id);
    if (!epiCheck) {
      throw new Error("Aucun contrôle d'EPI trouvé avec cet identifiant.");
    }
    return epiCheck;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erreur inconnue";
    throw new Error(
      `Erreur lors de la récupération du contrôle d'EPI: ${errorMessage}`
    );
  }
};

export const addNewEpiCheck = async (epiCheck: EpiCheck) => {
  try {
    if (!epiCheck.date_contrôle || !epiCheck.epi_id) {
      throw new Error(
        "Les champs 'date_contrôle' et 'epi_id' sont obligatoires pour ajouter un contrôle d'EPI."
      );
    }

    const result = await epiCheckModel.addOne(epiCheck);

    return {
      message: "Contrôle d'EPI ajouté avec succès.",
      id: result.insertId,
    };
  } catch (error) {
    console.error("Erreur dans addNewEpiCheck :", error);
    throw new Error(
      `Erreur lors de l'ajout du contrôle d'EPI: ${
        error instanceof Error ? error.message : "Erreur inconnue"
      }`
    );
  }
};

export const updateEpiCheck = async (epiCheck: EpiCheck) => {
  try {
    if (!epiCheck.id) {
      throw new Error("L'ID est obligatoire pour la mise à jour.");
    }

    const result = await epiCheckModel.update(epiCheck);

    if (result.affectedRows === 0) {
      throw new Error(
        `Aucun contrôle d'EPI mis à jour. ID ${epiCheck.id} non trouvé.`
      );
    }

    return {
      message: `Contrôle d'EPI avec ID ${epiCheck.id} mis à jour.`,
      data: epiCheck,
    };
  } catch (error) {
    console.error("Erreur détaillée dans updateEpiCheck :", error);
    throw new Error(
      `Erreur lors de la mise à jour du contrôle d'EPI: ${
        error instanceof Error ? error.message : "Erreur inconnue"
      }`
    );
  }
};

export const deleteEpiCheck = async (id: number) => {
  try {
    const result = await epiCheckModel.delete(id);

    if (result.affectedRows === 0) {
      throw new Error(`Aucun contrôle d'EPI supprimé. ID ${id} non trouvé.`);
    }

    return {
      message: `Contrôle d'EPI avec ID ${id} supprimé.`,
    };
  } catch (error) {
    console.error("Erreur dans deleteEpiCheck :", error);
    throw new Error(
      `Erreur lors de la suppression du contrôle d'EPI : ${
        error instanceof Error ? error.message : "Erreur inconnue"
      }`
    );
  }
};
