import express from "express";
import dotenv from "dotenv";
import db from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import eventRoutes from "./routes/event.routes.js";
import { errorHandler, pageNotFound } from "./middlewares/error.middleware.js";

dotenv.config();

const app = express();
const baseURL = "/api/v1";

db();
app.use(express.json());


app.use(`${baseURL}/users`, userRoutes);
app.use(`${baseURL}/categories`, categoryRoutes);
app.use(`${baseURL}/events`, eventRoutes);
app.use(pageNotFound);
app.use(errorHandler);

app.listen(process.env.PORT, () =>
  console.log(`Server is listening on port ${process.env.PORT}`)
);

export default app;
