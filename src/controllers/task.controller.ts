import { Request, Response } from "express";
import db from "../db/db-connection";
import { Task } from "../model/types";

export const getAllTasks = async (req: Request, res: Response) => {
  const queryset = await db.query<Task>("SELECT * FROM task");
  res.json({
    length: queryset.rowCount,
    data: queryset.rows,
  });
};

export const postTask = async (req: Request, res: Response) => {
  const { title, is_completed } = req.body;
  const max =
    (await db.query<{ max: number }>("SELECT MAX(position) FROM task")).rows[0]
      .max + 1;

  const queryset = await db.query<Task>(
    "INSERT INTO task (title, is_completed, position) VALUES ($1, $2, $3) RETURNING *",
    [title, is_completed, max],
  );
  res.json(queryset.rows[0]);
};

export const updateMultipleTasks = async (req: Request, res: Response) => {
  const { tasks } = req.body;
  const queries = tasks.map((task: { id: string; position: number }) => {
    return db.query<Task>(
      "UPDATE task SET position = $1 WHERE id = $2 RETURNING *",
      [task.position, task.id],
    );
  });
  const queryset = [...(await Promise.allSettled(queries)).values()];
  const changedData = queryset.flatMap((query) => {
    if (!("value" in query)) return [];
    return query.value.rows;
  });

  res.json({
    message: "Tareas actualizadas",
    length: changedData.length,
    data: changedData,
  });
};

export const getTaskById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const queryset = await db.query<Task>("SELECT * FROM task WHERE id = $1", [
    id,
  ]);
  res.json(queryset.rows[0]);
};

export const updateTaskById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { currentTask } = res.locals;
  const {
    title = currentTask.title,
    is_completed = currentTask.is_completed,
    position = currentTask.position,
  } = req.body;

  if (position !== currentTask.position) {
    // going up
    if (position > currentTask.position) {
      await db.query(
        "UPDATE task SET position = position - 1 WHERE position <= $1 AND position > $2",
        [position, currentTask.position],
      );
    }
    // going down
    if (position < currentTask.position) {
      await db.query(
        "UPDATE task SET position = position + 1 WHERE position >= $1 AND position < $2",
        [position, currentTask.position],
      );
    }
  }

  const queryset = await db.query<Task>(
    "UPDATE task SET title = $1, is_completed = $2, position = $3, updated_at = NOW() WHERE id = $4 RETURNING *",
    [title, is_completed, position, id],
  );
  return res.json(queryset.rows[0]);
};

export const deleteTaskById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const [task] = (
    await db.query<Task>("SELECT * FROM task WHERE id = $1", [id])
  ).rows;

  // update position of every task with a position greater than the deleted task
  await db.query(
    "UPDATE task SET position = position - 1 WHERE position > $1",
    [task.position],
  );

  const queryset = await db.query(
    "DELETE FROM task WHERE id = $1 RETURNING *",
    [id],
  );

  res.json(queryset.rows[0]);
};
