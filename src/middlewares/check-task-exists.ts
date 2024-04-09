import db from "../db/db-connection";
import { NextFunction, Request, Response } from "express";

export const checkPosition = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { position } = req.body;

  if (position < 1)
    res.status(400).json({
      message:
        "La posición de la tarea debe ser un número entero y una posición válida",
    });

  const [{ max }] = (
    await db.query<{ max: number }>("SELECT MAX(position) FROM task")
  ).rows;
  if (position > max + 1)
    res.status(400).json({
      message: `La posición de la tarea debe ser un número entero y una posición válida, la posición máxima es ${max + 1}`,
    });

  next();
};

export const checkTaskExists = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const queryset = await db.query("SELECT * FROM task WHERE id = $1", [id]);
  if (queryset.rowCount === 0) {
    return res.status(404).json({ message: "Task no encontrada" });
  }
  console.log(res.locals);
  res.locals.currentTask = queryset.rows[0];
  next();
};
