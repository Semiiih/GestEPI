import express, { NextFunction, Request, Response } from "express";
import {
  getAllUsers,
  getUserById,
  addNewUser,
  updateUser,
  deleteUser,
} from "../managers/UserManager";
import { User } from "../../../Types";
import { toJson } from "../utils/functions";

const router = express.Router();

router.get(
  "/",
  async (
    request: Request,
    response: Response<User[] | string>,
    next: NextFunction
  ) => {
    try {
      const users = await getAllUsers();
      response.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:id",
  async (
    request: Request<{ id: string }>,
    response: Response<User | string>,
    next: NextFunction
  ) => {
    try {
      const { id } = request.params;
      const user = await getUserById(Number(id));

      if (user === null) {
        response.status(404).json(`Aucun utilisateur trouvé avec l'ID ${id}`);
        return;
      }

      response.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/",
  async (
    request: Request<{}, {}, User>,
    response: Response<User | string>,
    next: NextFunction
  ) => {
    try {
      const newUser = request.body;
      const result = await addNewUser(newUser);
      response.status(201).json(toJson(result));
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:id",
  async (
    request: Request<{ id: string }, {}, User>,
    response: Response<{ message: string }>,
    next: NextFunction
  ) => {
    try {
      const { id } = request.params;

      const updatedUser: User = {
        ...request.body,
        id: Number(id),
      };

      const result = await updateUser(updatedUser);
      response.status(200).json(result);
    } catch (error) {
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
      console.log(`Tentative de suppression de l'utilisateur avec ID : ${id}`);
      const result = await deleteUser(Number(id));
      response.status(200).json(result);
    } catch (error) {
      console.error("Erreur dans le contrôleur DELETE :", error);
      next(error);
    }
  }
);

export default router;
