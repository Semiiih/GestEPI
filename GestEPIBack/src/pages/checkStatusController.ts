import express, { Request, Response, NextFunction } from "express";
import {
  getAllCheckStatuses,
  getCheckStatusById,
  addNewCheckStatus,
  updateCheckStatus,
  deleteCheckStatus,
} from "../managers/checkStatusManager";
import { CheckStatus } from "../../../Types";

const router = express.Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const statuses = await getAllCheckStatuses();
    res.status(200).json(statuses);
  } catch (error) {
    next(error);
  }
});

router.get(
  "/:id",
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const status = await getCheckStatusById(Number(id));
      res.status(200).json(status);
    } catch (error) {
      next(error);
    }
  }
);

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newStatus = req.body;
    const result = await addNewCheckStatus(newStatus);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.put(
  "/:id",
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const updatedStatus: CheckStatus = { ...req.body, id: Number(id) };
      const result = await updateCheckStatus(updatedStatus);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:id",
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await deleteCheckStatus(Number(id));
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
