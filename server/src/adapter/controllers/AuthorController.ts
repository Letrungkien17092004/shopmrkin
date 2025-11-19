import { Request, Response } from "express";
import axios from "axios"
import IUserUsecase from "../../core/applications/interfaces/usecases/IUserUsecase.js";
import IAdminSystemUsecase from "../../core/applications/interfaces/usecases/IAdminSystemUsecase.js";
import ICartUsecase from "../../core/applications/interfaces/usecases/ICartUsecase.js";
import { USECASE_ERROR, USECASE_ERROR_CODE } from "../../core/applications/interfaces/usecases/errors.js";
import jwt from "jsonwebtoken";
import { ENV } from "../../config/env.js";
import { z } from "zod"

interface GoogleUserProfile {
    email: string,
    family_name: string,
    given_name: string,
    id: string,
    name: string,
    picture: string,
    verified_email: boolean,
}

interface JWTPayload {
    id: string,
    account: string,
    username: string,
    email: string,
    role: string,
    permissions: string[]

}

interface InternalProfile {
    id: string,
    account: string,
    username: string,
    email: string,
    picture: string,
    role: string,
    cartId: string
}


export default class AuthorController {

    private userUsecase: IUserUsecase
    private adminSystemUsecase: IAdminSystemUsecase
    private cartUsecase: ICartUsecase

    constructor(userUsecase: IUserUsecase, adminSystemUsecase: IAdminSystemUsecase, cartUsecase: ICartUsecase) {
        this.userUsecase = userUsecase
        this.adminSystemUsecase = adminSystemUsecase
        this.cartUsecase = cartUsecase
    }

    /**
     * Sign-in with account, password
     * @param req 
     * @param res 
     * @returns 
     */
    register = async (req: Request, res: Response): Promise<void> => {
        try {

            const BodySchema = z.object({
                username: z.string().min(5).max(50),
                account: z.email().max(50),
                password: z.string().min(1),
                email: z.email().max(50)
            })

            const bodyParsed = BodySchema.parse(req.body)
            const createdUser = await this.userUsecase.create({
                data: {
                    username: bodyParsed.username,
                    account: bodyParsed.account,
                    password: bodyParsed.password,
                    email: bodyParsed.email
                }
            })

            const createdCart = await this.cartUsecase.create({
                data: {
                    userId: createdUser.id
                }
            })

            res.status(200).json({
                user: {
                    id: createdUser.id,
                    username: createdUser.username,
                    account: createdUser.account,
                    email: createdUser.email,
                }
            })
        } catch (error) {
            console.log(error)
            if (error instanceof z.ZodError) {
                res.status(400).json({
                    message: "Invalid body data",
                })
                return
            }

            if (error instanceof USECASE_ERROR) {
                switch (error.code) {
                    case USECASE_ERROR_CODE.CONFLIX:
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

    /**
     * Login with account and password, create refesh_token when success
     * @param req 
     * @param res 
     * @returns 
     */
    login = async (req: Request, res: Response): Promise<void> => {
        try {
            const BodySchema = z.object({
                account: z.email().max(50),
                password: z.string().min(1).max(255),
            })

            const bodyParsed = BodySchema.parse(req.body)

            const foundUser = await this.userUsecase.login(bodyParsed)

            if (!foundUser) {
                res.status(404).json({
                    messsage: "wrong account or password"
                })
                return
            }
            const payload: JWTPayload = {
                id: foundUser.id,
                account: foundUser.account,
                username: foundUser.username,
                email: foundUser.email,
                role: foundUser.role!.roleName,
                permissions: foundUser.role!.permissions!.map(per => per.perName)
            }

            const profile: InternalProfile = {
                id: foundUser.id,
                username: foundUser.username,
                account: foundUser.account,
                email: foundUser.email,
                picture: "",
                role: foundUser.role?.roleName || "undefined",
                cartId: foundUser.cart!.id
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
                profile: profile,
                refeshToken: refeshToken,
                accessToken: accessToken,
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

    /**
     * Create access_token, require refesh_token to use
     * @param req 
     * @param res 
     * @returns 
     */
    createAccessToken = async (req: Request, res: Response): Promise<void> => {
        try {
            // there isn't author property
            if (!req.user) {
                res.status(401).json({
                    message: "Unauthorized"
                })
                return
            }

            const user = await this.userUsecase.getById(req.user.id)

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

    /**
     * Verify access_token
     * @param req 
     * @param res 
     * @returns 
     */
    verifyAccessToken = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.user) {
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

    /**
     * Generate URL Google OAuth2, which is used to redirect to the Google login page
     * @param req 
     * @param res 
     */
    generateOauth2RedirectUrl = async (req: Request, res: Response): Promise<void> => {
        try {
            const redirect_uri = req.query["redirect_uri"]
            if (!redirect_uri) {
                res.status(400).json({
                    message: "missing redirect_uri"
                })
                return
            }
            const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth"
            const options = {
                redirect_uri: redirect_uri.toString(),
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

    /**
     * Login with Google, this controller uses Google's state and access_token to get the user's profile
     * if the user has never signed-in with Google, new account will be created, then sign JWT
     * @param req 
     * @param res 
     * @returns 
     */
    loginWithGoogle = async (req: Request, res: Response): Promise<void> => {
        try {
            const access_token = req.query["access_token"] as string
            const state = req.query["state"] as string
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
                const googleUser = await axios.get<GoogleUserProfile>(
                    `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`
                )
                const googleProfile = googleUser.data
                const foundUser = await this.userUsecase.findByEmail({
                    where: {
                        email: googleProfile.email
                    }
                })

                var payload: JWTPayload | null = null
                var profile: InternalProfile | null = null
                // if user wasn't found
                if (!foundUser) {
                    const createdUser = await this.userUsecase.create({
                        data: {
                            username: googleProfile.name,
                            account: googleProfile.email,
                            password: new Date().toString(),
                            email: googleProfile.email
                        }
                    })
                    const createdCart = await this.cartUsecase.create({
                        data: {
                            userId: createdUser.id
                        }
                    })

                    payload = {
                        id: createdUser.id,
                        username: createdUser.username,
                        account: createdUser.account,
                        email: createdUser.email,
                        role: createdUser.role?.roleName || "undefined",
                        permissions: []
                    }

                    profile = {
                        id: createdUser.id,
                        username: createdUser.username,
                        account: createdUser.account,
                        email: createdUser.email,
                        picture: googleProfile.picture,
                        role: createdUser.role?.roleName || "undefined",
                        cartId: createdCart.id
                    }
                } else { // user was found
                    payload = {
                        id: foundUser.id,
                        username: foundUser.username,
                        account: foundUser.account,
                        email: foundUser.email,
                        role: foundUser.role?.roleName || "undefined",
                        permissions: []
                    }

                    profile = {
                        id: foundUser.id,
                        username: foundUser.username,
                        account: foundUser.account,
                        email: foundUser.email,
                        picture: googleProfile.picture,
                        role: foundUser.role!.roleName || "undefined",
                        cartId: foundUser.cart!.id
                    }
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

                res.status(200).json({
                    profile: profile,
                    refeshToken: refeshToken,
                    accessToken: accessToken,
                })
            } catch (error) {
                console.log("error in AuthorController", error)
                res.status(500).json({
                    message: "Something went wrong"
                })
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({
                message: "Something went wrong"
            })
        }
    }
}


