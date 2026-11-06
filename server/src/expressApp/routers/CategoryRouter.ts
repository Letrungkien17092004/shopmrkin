import { Router } from "express";
import CategoryRepository from "../../repositories/CategoryRepository.js";
import CategoryUsecase from "../../core/applications/usecases/CategoryUsecase.js";
import CategoryController from "../../adapter/controllers/CategoryController.js";

const categoryRepo = new CategoryRepository();
const categoryUsecase = new CategoryUsecase(categoryRepo);
const categoryController = new CategoryController(categoryUsecase);

const categoryRouter = Router();

categoryRouter.get("/categories", categoryController.findMany);

export default categoryRouter;
