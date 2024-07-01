import { Router } from "express";
import {
  createCategory,
  getAllCategory,
  getCategoryById,
  updateCategoryById
} from "../controllers/category.controllers.js";

const categoryRouter = Router();

categoryRouter.post("/", createCategory);
categoryRouter.get("/", getAllCategory);
categoryRouter.get("/:categoryId", getCategoryById);
categoryRouter.put("/:categoryId", updateCategoryById);

export default categoryRouter;
