import express, { NextFunction, Request, Response } from "express";
import {
  getAllEpiChecks,
  getEpiCheckById,
  addNewEpiCheck,
  updateEpiCheck,
  deleteEpiCheck,
} from "../managers/EpiCheckManager";
import { EpiCheck } from "../../../Types";

const router = express.Router();

router.get(
  "/",
  async (
    request: Request,
    response: Response<EpiCheck[] | string>,
    next: NextFunction
  ) => {
    try {
      const epiChecks = await getAllEpiChecks();

      if (!epiChecks || epiChecks.length === 0) {
        response.status(404).json("Aucun contrôle d'EPI trouvé.");
        return;
      }

      response.status(200).json(epiChecks);
    } catch (error) {
      console.error("Erreur dans la route GET EpiChecks / :", error);
      next(error);
    }
  }
);

router.get(
  "/:id",
  async (
    request: Request<{ id: string }>,
    response: Response<EpiCheck | string>,
    next: NextFunction
  ) => {
    try {
      const { id } = request.params;

      const epiCheck = await getEpiCheckById(Number(id));

      if (!epiCheck) {
        response
          .status(404)
          .json(`Aucun contrôle d'EPI trouvé avec l'ID ${id}.`);
        return;
      }
      response.status(200).json(epiCheck);
    } catch (error) {
      console.error("Erreur dans la route GET EpiChecks /:id :", error);
      next(error);
    }
  }
);

router.post(
  "/",
  async (
    request: Request<{}, {}, EpiCheck>,
    response: Response<{ message: string; id: number } | string>,
    next: NextFunction
  ) => {
    try {
      const newEpiCheck = await addNewEpiCheck(request.body);
      response.status(201).json(newEpiCheck);
    } catch (error) {
      console.error(
        "Erreur lors de la création d'un nouveau contrôle d'EPI :",
        error
      );
      next(error);
    }
  }
);

router.put(
  "/:id",
  async (
    request: Request<{ id: string }, {}, EpiCheck>,
    response: Response<{ message: string } | string>,
    next: NextFunction
  ) => {
    try {
      const { id } = request.params;
      const updatedEpiCheck: EpiCheck = { ...request.body, id: Number(id) };

      if (!updatedEpiCheck.id) {
        return response.status(400).json("ID est requis pour la mise à jour.");
      }

      const result = await updateEpiCheck(updatedEpiCheck);
      response.status(200).json(result);
    } catch (error) {
      console.error("Erreur dans la route PUT EpiChecks :", error);
      next(error);
    }
  }
);

router.delete(
  "/:id",
  async (
    request: Request<{ id: string }>,
    response: Response<{ message: string } | string>,
    next: NextFunction
  ) => {
    try {
      const { id } = request.params;
      const result = await deleteEpiCheck(Number(id));
      response.status(200).json(result);
    } catch (error) {
      console.error("Erreur dans la route DELETE EpiChecks :", error);
      next(error);
    }
  }
);

export default router;
