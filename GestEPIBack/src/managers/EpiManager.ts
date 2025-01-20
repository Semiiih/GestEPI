import { epiModel } from "../models/epiModel";
import { Epi } from "../../../Types";
import { NextFunction, Request } from "express";

export const getAllEpi = async (
  filterParams?: Record<string, string | number>
) => {
  try {
    const epis = await epiModel.getAll(filterParams);
    if (epis.length === 0) {
      throw new Error("Aucun EPI trouvé.");
    }
    return epis;
  } catch (error) {
    throw new Error(`Erreur lors de la récupération des EPI: ${error}`);
  }
};

export const getEpiById = async (id: number) => {
  try {
    const epi = await epiModel.getById(id);
    if (!epi) {
      throw new Error("Aucun EPI trouvé avec cet identifiant.");
    }
    return epi;
  } catch (error) {
    throw new Error(`Erreur lors de la récupération de l'EPI: ${error}`);
  }
};

export const addNewEpi = async (request: Request, next: NextFunction) => {
  try {
    if (!request.body.type_id) {
      throw new Error("Le type d'EPI est requis.");
    }
    const {
      id,
      type_id,
      identifiant_personnalise,
      marque,
      modèle,
      numéro_série,
      taille,
      couleur,
      date_achat,
      date_fabrication,
      date_mise_service,
      périodicité_contrôle,
    } = request.body;
    const newEpi: Epi = {
      id,
      type_id,
      identifiant_personnalise,
      marque,
      modèle,
      numéro_série,
      taille,
      couleur,
      date_achat,
      date_fabrication,
      date_mise_service,
      périodicité_contrôle,
    };
    const result = await epiModel.addOne(newEpi);
    if (result.affectedRows === 0) {
      throw new Error("");
    } else {
      const newEPI = await epiModel.getById(Number(result.insertId));
      return newEPI;
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'EPI:", error);
    throw new Error(`Erreur lors de l'ajout de l'EPI: ${error}`);
  }
};

export const updateEpi = async (epi: Epi) => {
  try {
    if (!epi.id) {
      throw new Error("L'ID est obligatoire pour la mise à jour.");
    }
    const result = await epiModel.update(epi);
    if (result.affectedRows === 0) {
      throw new Error("Aucun EPI mis à jour. ID non trouvé.");
    }
    return {
      message: `EPI avec ID ${epi.id} mis à jour.`,
    };
  } catch (error) {
    throw new Error(`Erreur lors de la mise à jour de l'EPI: ${error}`);
  }
};

export const deleteEpi = async (id: number) => {
  try {
    const result = await epiModel.delete(id);
    if (result.affectedRows === 0) {
      throw new Error("Aucun EPI supprimé. ID non trouvé.");
    }
    return {
      message: `EPI avec ID ${id} supprimé.`,
    };
  } catch (error) {
    throw new Error(`Erreur lors de la suppression de l'EPI: ${error}`);
  }
};
