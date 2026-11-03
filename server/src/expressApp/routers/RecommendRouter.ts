import { Router } from "express";
import RecommendRepository from "../../repositories/RecommendRepository.js";
import RecommendController from "../../adapter/controllers/RecommendController.js";

const recommendRepo = new RecommendRepository();
const recommendController = new RecommendController(recommendRepo);

const recommendRouter = Router();

recommendRouter.get("/ml-data/recommend-system-content-based", recommendController.getContentBasedData);
recommendRouter.get("/products/:productId/similar", recommendController.getSimilarProducts);
recommendRouter.get("/product/:id/similar", recommendController.getSimilarProducts);

export default recommendRouter;
