import express from "express";
import cors from "cors";
import morgan from "morgan";
import taskRoutes from "./src/routes/task.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({ message: "Bienvenido a la API de la lista de tareas" });
});

app.use("/api/v1/task", taskRoutes);

app.all("*", (req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
