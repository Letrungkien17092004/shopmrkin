import { Request, Response } from "express";

/**
 * This controller is for Demo, test param, query, cooki,... purposes only
 */
export default class DemoController {


    test = async (req: Request, res: Response): Promise<void> => {
        console.log(req.url)
        console.log(req.ip)
        res.status(200).json({
            message: "OK"
        })
    }
}