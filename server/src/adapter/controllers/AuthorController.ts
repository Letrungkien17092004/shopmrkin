import e, { Request, Response } from "express";
import IUserUsecase from "core/applications/interfaces/usecases/IUserUsecase.js";
import IAdminSystemUsecase from "core/applications/interfaces/usecases/IAdminSystemUsecase.js";
import { USECASE_ERROR, USECASE_ERROR_CODE } from "core/applications/interfaces/usecases/errors";

export default class AuthorController {

    private userUsecase: IUserUsecase
    private adminSystemUsecase: IAdminSystemUsecase

    constructor(userUsecase: IUserUsecase, adminSystemUsecase: IAdminSystemUsecase) {
        this.userUsecase = userUsecase
        this.adminSystemUsecase = adminSystemUsecase
    }


    async register(req: Request, res: Response): Promise<void> {
        try {
            let username = req.body['username']
            let account = req.body['account']
            let password = req.body['password']
            let email = req.body['password']

            console.log({
                username,
                account,
                password,
                email
            })
            const createdUser = await this.userUsecase.create({
                username: username,
                account: account,
                password_hash: password,
                email: email
            })

            res.status(200).json({
                message: "OK"
            })
        } catch (error) {
            console.log(error)
            if (error instanceof TypeError) {
                res.status(400).json({
                    message: "Missing data",
                })
            }

            if (error instanceof USECASE_ERROR) {
                switch (error.code) {
                    case USECASE_ERROR_CODE.EXISTED:
                        res.status(409).json({
                            message: "User already exist"
                        })
                        return
                }
            }
            res.status(500).json({
                message: "Somethings wrong",
                detail: `${(error as Error).message}`
            })
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        throw new Error("No code!")
    }

    async generateAccessToken(req: Request, res: Response): Promise<void> {
        throw new Error("No code!")
    }

    async getRefreshToken(req: Request, res: Response): Promise<void> {
        throw new Error("No code!")
    }
}