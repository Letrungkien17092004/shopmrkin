import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"
import { ENV } from "config/env.js";
import { z } from "zod"

export async function authorRefeshToken(req: Request, res: Response, next: NextFunction) {
    try {
        const authorToken = req.headers["authorization"]?req.headers["authorization"].split(" ")[1]:undefined
        if (!authorToken) {
            res.status(401).json({
                message: "Unauthorized "
            })
            return
        }
        if (!authorToken) {
            res.status(401).json({
                message: "Unauthorized "
            })
            return
        }
        const PayloadSchema = z.object({
            id: z.string(),
            account: z.string(),
            username: z.string(),
            email: z.string(),
            role: z.string(),
            permissions: z.array(z.string())
        })

        const deocoded = jwt.verify(authorToken, ENV.JWT_SECRET)
        const payload = PayloadSchema.parse(deocoded)

        req.user = payload
        next()
    } catch (error) {
        console.log("Log in author middleware")
        console.log(error)

        // token is invalid
        if (
            error instanceof jwt.JsonWebTokenError ||
            error instanceof jwt.TokenExpiredError ||
            error instanceof jwt.NotBeforeError
        ) {
            res.status(403).json({
                message: "Forbidden"
            })
            return
        }

        // zod parser error
        if (error instanceof z.ZodError) {
            res.status(400).json({
                message: "Invalid token payload",
            })
            return
        }

        res.status(500).json({
            message: "Somethings wrong"
        })
    }
}

export async function authorAccessToken(req: Request, res: Response, next: NextFunction) {
    try {
        const authorToken = req.headers["authorization"]?req.headers["authorization"].split(" ")[1]:undefined
        if (!authorToken) {
            res.status(401).json({
                message: "Unauthorized "
            })
            return
        }
        const PayloadSchema = z.object({
            id: z.string(),
            account: z.string(),
            username: z.string(),
            email: z.string(),
            role: z.string(),
            permissions: z.array(z.string())
        })

        const deocoded = jwt.verify(authorToken, ENV.JWT_SECRET)
        const payload = PayloadSchema.parse(deocoded)

        req.user = payload
        next()
    } catch (error) {
        console.log("Log in author middleware")
        console.log(error)

        // token is invalid
        if (
            error instanceof jwt.TokenExpiredError ||
            error instanceof jwt.NotBeforeError
        ) {
            console.log("JWT token has expired")
            res.status(401).json({
                message: "JWT token has expired"
            })
            return
        }

        // zod parser error
        if (error instanceof z.ZodError) {
            res.status(400).json({
                message: "Invalid token payload",
            })
            return
        }

        res.status(500).json({
            message: "Somethings wrong"
        })
    }
}