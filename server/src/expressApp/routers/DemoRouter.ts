import { Router } from "express";
import DemoController from "../../adapter/controllers/DemoController.js";

const controller = new DemoController()
const demoRouter = Router()

demoRouter.get('/demo/test', controller.test)
demoRouter.post('/demo/test', controller.test)

export default demoRouter