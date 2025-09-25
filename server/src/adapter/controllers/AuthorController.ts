import { Request, Response } from "express";
import axios from "axios"
import IUserUsecase from "core/applications/interfaces/usecases/IUserUsecase.js";
import IAdminSystemUsecase from "core/applications/interfaces/usecases/IAdminSystemUsecase.js";
import { USECASE_ERROR, USECASE_ERROR_CODE } from "core/applications/interfaces/usecases/errors.js";
import jwt from "jsonwebtoken";
import { ENV } from "config/env.js";

type GoogleUserProfile = {
    email: string,
    family_name: string,
    given_name: string,
    id: string,
    name: string,
    picture: string,
    verified_email: boolean,
}

type JWTPayload = {
    id: string,
    account: string,
    username: string,
    email: string,
    role: string,
    permissions: string[]

}


export default class AuthorController {

    private userUsecase: IUserUsecase
    private adminSystemUsecase: IAdminSystemUsecase

    constructor(userUsecase: IUserUsecase, adminSystemUsecase: IAdminSystemUsecase) {
        this.userUsecase = userUsecase
        this.adminSystemUsecase = adminSystemUsecase

        this.register = this.register.bind(this)
        this.login = this.login.bind(this)
        this.generateAccessToken = this.generateAccessToken.bind(this)
        this.verifyAccessToken = this.verifyAccessToken.bind(this)
        this.generateOauth2RedirectUrl = this.generateOauth2RedirectUrl.bind(this)
        this.authGoogleCallBack = this.authGoogleCallBack.bind(this)
    }


    async register(req: Request, res: Response): Promise<void> {
        try {
            let username = req.body['username']
            let account = req.body['account']
            let password = req.body['password']
            let email = req.body['email']

            if (!(username && account && password && email)) {
                throw new TypeError("can't read username, account, password, email")
            }
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
                return
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
        try {
            const account = req.body['account']
            const password = req.body['password']

            if (!account || !password) {
                throw new TypeError("Can't read account or password")
            }
            const user = await this.userUsecase.login({ account, password })
            // no match
            if (!user) {
                res.status(404).json({
                    messsage: "wrong account or password"
                })
                return
            }
            const payload: JWTPayload = {
                id: user.id,
                account: user.account,
                username: user.username,
                email: user.email,
                role: user.role!.roleName,
                permissions: user.role!.permissions!.map(per => per.perName)
            }
            const refeshToken = jwt.sign(
                payload,
                ENV.JWT_SECRET,
                {
                    expiresIn: ENV.REFESH_EXPRISES_IN
                }
            )
            const accessToken = jwt.sign(
                payload,
                ENV.JWT_SECRET,
                {
                    expiresIn: ENV.ACCESS_EXPRISES_IN
                }
            )
            res.status(200).json({
                message: "OK",
                refeshToken: refeshToken,
                accessToken: accessToken
            })
            return
        } catch (error) {
            console.log(error)
            if (error instanceof USECASE_ERROR) {
                switch (error.code) {
                    case USECASE_ERROR_CODE.INITIAL:
                        res.status(500).json({
                            message: "Database error"
                        })
                        return
                }
            }
            if (error instanceof TypeError) {
                res.status(400).json({
                    message: "Missing data, require account and password"
                })
                return
            }
            res.status(500).json({
                message: "somgthings wrong"
            })

        }
    }

    async generateAccessToken(req: Request, res: Response): Promise<void> {
        try {
            // there isn't author property
            if (!req.author) {
                res.status(401).json({
                    message: "Unauthorized"
                })
                return
            }

            const user = await this.userUsecase.getById(req.author.id)

            // user not found
            if (!user) {
                res.status(404).json({
                    message: "User not found"
                })
                return
            }

            const payload = {
                id: user.id,
                account: user.account,
                username: user.username,
                email: user.email,
                role: user.role?.roleName,
                permissions: user.role?.permissions?.map(per => per.perName)
            }

            const accessToken = jwt.sign(payload, ENV.JWT_SECRET, {
                expiresIn: ENV.ACCESS_EXPRISES_IN
            })

            res.status(200).json({
                message: "OK",
                accessToken: accessToken
            })

        } catch (error) {
            res.status(500).json({
                message: "Internal server error"
            })
        }
    }

    async verifyAccessToken(req: Request, res: Response): Promise<void> {
        try {
            if (!req.author) {
                res.status(401).json({
                    message: "Unauthorized"
                })
                return
            }
            res.status(200).json({
                message: "AccessToken excepted"
            })
        } catch (error) {
            res.status(500).json({
                message: "Server internal error!"
            })
        }
    }

    // generate URL Google OAuth2
    async generateOauth2RedirectUrl(req: Request, res: Response): Promise<void> {
        try {
            const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth"
            const options = {
                redirect_uri: ENV.REDIRECT_URI,
                client_id: ENV.GOOGLE_CLIENT_ID,
                state: ENV.GOOGLE_OAUTH_STATE_STRING,
                response_type: "token",
                prompt: "consent",
                scope: [
                    "profile",
                    "email"
                ].join(" "),
            };

            const qs = new URLSearchParams(options).toString();
            res.status(200).json({
                url: `${rootUrl}?${qs}`
            })
        } catch (error) {
            res.status(500).json({
                message: "Something went wrong"
            })
        }
    }

    // receive access_token (google token) from request, then abtain profile from Google API
    async authGoogleCallBack(req: Request, res: Response): Promise<void> {
        try {
            const access_token = req.query["access_token"] as string
            const state = req.query["state"] as string
            console.log(req.query)
            if (!state || state !== ENV.GOOGLE_OAUTH_STATE_STRING) {
                res.status(400).json({
                    message: "Invalid state string"
                })
                return
            }
            if (!access_token || access_token === "") {
                res.status(400).json({
                    message: "Missing access_token"
                })
                return
            }

            try {
                // get profile from google
                const userRes = await axios.get<GoogleUserProfile>(
                    `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`
                )
                const profile = userRes.data
                const userInDB = await this.userUsecase.getOrCreate({
                    username: profile.name,
                    account: profile.email,
                    email: profile.email,
                })
                const payload: JWTPayload = {
                    id: userInDB.id,
                    account: userInDB.account,
                    username: userInDB.username,
                    email: userInDB.email,
                    role: userInDB.role!.roleName,
                    permissions: userInDB.role!.permissions!.map(p => p.perName)
                }
                const refeshToken = jwt.sign(
                    payload,
                    ENV.JWT_SECRET,
                    {
                        expiresIn: ENV.REFESH_EXPRISES_IN
                    }
                )
                const accessToken = jwt.sign(
                    payload,
                    ENV.JWT_SECRET,
                    {
                        expiresIn: ENV.REFESH_EXPRISES_IN
                    }
                )

                res.cookie("refesh_token", refeshToken, {
                    httpOnly: true
                })
                
                res.cookie("access_token", accessToken, {
                    httpOnly: true
                })

                res.status(200).json({
                    profile: {
                        id: payload.id,
                        account: payload.account,
                        username: payload.username,
                        email: payload.email,
                    },
                    refeshToken: refeshToken,
                    accessToken: accessToken,
                })
                return
            } catch (error) {
                console.log(error)
                res.status(500).json({
                    message: "Something went wrong"
                })
                return
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({
                message: "Something went wrong"
            })
        }
    }

}