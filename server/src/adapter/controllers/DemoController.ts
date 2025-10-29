import { Request, Response } from "express";
import { z } from "zod"
/**
 * This controller is for Demo, test param, query, cooki,... purposes only
 */
export default class DemoController {


    test = async (req: Request, res: Response): Promise<void> => {
        try {
            const rawInclude = req.query.include as Object as { user: string, cartItem: string }
            let include: { user: boolean, cartItem: boolean } | undefined
            if (rawInclude && typeof rawInclude === "object") {
                include = {
                    user: rawInclude.user === "true",
                    cartItem: rawInclude.cartItem === "true"
                }
            }
            const FindSchema = z.object({
                userId: z.string().optional(),
                include: z.object({
                    user: z.boolean().optional(),
                    cartItem: z.boolean().optional()
                }).optional()
            })
            console.log(include)
            const parsed = FindSchema.parse({
                userId: req.query.userId,
                include: include
            })
            console.log(parsed)
            res.status(200).json({
                message: "OK"
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({
                message: "Server internal error!"
            })
        }
    }
}