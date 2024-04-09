import { Router } from "express";
import { body, param } from "express-validator";
import { validateChecks } from "../middlewares/valida-checks";
import {
  deleteTaskById,
  getAllTasks,
  getTaskById,
  postTask,
  updateMultipleTasks,
  updateTaskById,
} from "../controllers/task.controller";
import {
  checkPosition,
  checkTaskExists,
} from "../middlewares/check-task-exists";

const router = Router();

router
  .route("/")
  .get(getAllTasks)
  .post(
    [
      body(
        "title",
        "El titulo de la tarea es requerido, y necesita almenos 4 caracteres",
      ).isLength({ min: 4 }),
      body("is_completed", "El estado de la tarea es requerido").isBoolean(),
      validateChecks,
    ],
    postTask,
  )
  // update multiple tasks positions
  .put(
    [
      body(
        "tasks",
        "Debes definir una lista de tareas conteniendo sus posiciones y id",
      ).isArray(),
      validateChecks,
    ],
    updateMultipleTasks,
  );

router
  .route("/:id")
  .get(
    [
      param("id", "Es necesario que el parametro id sea definido").isInt(),
      validateChecks,
      checkTaskExists,
    ],
    getTaskById,
  )
  .put(
    [
      param("id", "Es necesario que el parametro id sea definido").isInt(),
      body(
        "title",
        "El titulo de la tarea de ser definido, necesita almenos 4 caracteres",
      )
        .optional()
        .isLength({ min: 4 }),
      body(
        "is_completed",
        "El estado de la de ser definido debe ser un booleano",
      )
        .optional()
        .isBoolean(),
      body(
        "position",
        "La posicion de la tarea debe ser un numero entero, y una posicion valida de ser definido",
      )
        .optional()
        .isInt({ min: 1 }),
      validateChecks,
      checkPosition,
      checkTaskExists,
    ],
    updateTaskById,
  )
  .delete(
    [
      param("id", "Es necesario que el parametro id sea definido").isInt(),
      validateChecks,
      checkTaskExists,
    ],
    deleteTaskById,
  );

export default router;
