import { Router } from "express";
import AuthorController from "adapter/controllers/AuthorController.js";
import { authorRefeshToken, authorAccessToken } from "expressApp/middlewares/author.middlewares.js";
import UserRepository from "repositories/UserRepository.js";
import RolesRepository from "repositories/RolesRepository.js";
import PermissionsRepository from "repositories/PermissionsRepository.js";
import RolePerRepository from "repositories/RolePerRepository.js";
import AdminSystemUsecase from "core/applications/usecases/AdminSystemUsecase.js";
import UserUsecase from "core/applications/usecases/UserUsecase.js";

const userRepo = new UserRepository()
const roleRepo = new RolesRepository()
const perRepo = new PermissionsRepository()
const rolePerRepo = new RolePerRepository()

const userUsecase = new UserUsecase(userRepo)
const adminUsecase = new AdminSystemUsecase(roleRepo, perRepo, rolePerRepo)
const authorController = new AuthorController(userUsecase, adminUsecase)

const authorRouter = Router()

authorRouter.post("/registor", authorController.register)
authorRouter.get("/login", authorController.login)
authorRouter.get("/access-token", [authorRefeshToken, authorController.generateAccessToken])
authorRouter.get("/verify-access-token", [authorAccessToken, authorController.verifyAccessToken])

export default authorRouter