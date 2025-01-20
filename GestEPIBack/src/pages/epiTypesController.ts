import express, { Request, Response, NextFunction } from "express";
import {
  getAllEpiTypes,
  getEpiTypeById,
  addNewEpiType,
  updateEpiType,
  deleteEpiType,
} from "../managers/EpiTypesManager";
import { EpiType } from "../../../Types";
import { toJson } from "../utils/functions";

const router = express.Router();

router.get(
  "/",
  async (
    req: Request,
    res: Response<EpiType[] | string>,
    next: NextFunction
  ) => {
    try {
      const epiTypes = await getAllEpiTypes();
      res.status(200).json(epiTypes);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:id",
  async (
    req: Request<{ id: string }>,
    res: Response<EpiType | string>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const epiType = await getEpiTypeById(Number(id));
      res.status(200).json(epiType);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/",
  async (
    req: Request<{}, {}, EpiType>,
    res: Response<{ id: number } | string>,
    next: NextFunction
  ) => {
    try {
      const newEpiType = req.body;
      const result = await addNewEpiType(newEpiType);
      res.status(201).json(toJson(result));
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:id",
  async (
    req: Request<{ id: string }, {}, EpiType>,
    res: Response<{ message: string }>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const updatedEpiType: EpiType = { ...req.body, id: Number(id) };
      const result = await updateEpiType(updatedEpiType);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:id",
  async (
    req: Request<{ id: string }>,
    res: Response<{ message: string }>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const result = await deleteEpiType(Number(id));
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
