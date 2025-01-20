import express, { Request, Response, NextFunction } from "express";
import {
  getAllUserTypes,
  getUserTypeById,
  addNewUserType,
  updateUserType,
  deleteUserType,
} from "../managers/UserTypesManager";
import { UserType } from "../../../Types";

const router = express.Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userTypes = await getAllUserTypes();
    res.status(200).json(userTypes);
  } catch (error) {
    next(error);
  }
});

router.get(
  "/:id",
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userType = await getUserTypeById(Number(id));
      res.status(200).json(userType);
    } catch (error) {
      next(error);
    }
  }
);

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newUserType = req.body;
    const result = await addNewUserType(newUserType);
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
      const updatedUserType: UserType = { ...req.body, id: Number(id) };
      const result = await updateUserType(updatedUserType);
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
      const result = await deleteUserType(Number(id));
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
