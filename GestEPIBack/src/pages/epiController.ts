import express, { NextFunction, Request, Response } from "express";
import {
  getAllEpi,
  getEpiById,
  addNewEpi,
  updateEpi,
  deleteEpi,
} from "../managers/EpiManager";
import { Epi } from "../../../Types";
import { toJson } from "../utils/functions";

const router = express.Router();

router.get(
  "/",
  async (
    request: Request,
    response: Response<Epi[] | string>,
    next: NextFunction
  ) => {
    try {
      const filterParams: Record<string, string | number> = {};

      Object.entries(request.query).forEach(([key, value]) => {
        if (typeof value === "string" || typeof value === "number") {
          filterParams[key] = value;
        }
      });

      const epis = await getAllEpi(filterParams);

      if (!epis || epis.length === 0) {
        response.status(404).json("Aucun EPI trouvé.");
        return;
      }

      response.status(200).json(epis);
    } catch (error) {
      console.error("Erreur dans la route GET / :", error);
      next(error);
    }
  }
);

router.get(
  "/:id",
  async (
    request: Request<{ id: string }>,
    response: Response<Epi | string>,
    next: NextFunction
  ) => {
    try {
      const { id } = request.params;

      const epi = await getEpiById(Number(id));

      if (!epi) {
        response.status(404).json(`Aucun EPI trouvé avec l'ID ${id}.`);
        return;
      }
      response.status(200).json(epi);
    } catch (error) {
      console.error("Erreur dans la route GET /:id :", error);
      next(error);
    }
  }
);

router.post(
  "/",
  async (
    request: Request,
    response: Response<{ message: string; id: number } | string>,
    next: NextFunction
  ) => {
    try {
      const result = await addNewEpi(request, next);
      response.status(201).json(result);
    } catch (error) {
      console.error("Erreur lors de la création d'un nouvel EPI :", error);
      next(error);
    }
  }
);

router.put(
  "/:id",
  async (
    request: Request<{ id: string }, {}, Epi>,
    response: Response<{ message: string } | string>,
    next: NextFunction
  ) => {
    try {
      const { id } = request.params;
      const updatedEpi: Epi = { ...request.body, id: Number(id) };

      if (!updatedEpi.id || !updatedEpi.type_id) {
        return response
          .status(400)
          .json("ID et type_id sont requis pour la mise à jour.");
      }

      const result = await updateEpi(updatedEpi);
      response.status(200).json(result);
    } catch (error) {
      console.error("Erreur dans la route PUT :", error);
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
      const result = await deleteEpi(Number(id));
      response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
