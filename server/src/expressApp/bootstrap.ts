import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser"
import { Request, Response, NextFunction } from "express";

import authorRouter from "expressApp/routers/AuthorRouter.js";
import productRouter from "./routers/ProductRouter.js";

function logRequest(req: Request, res: Response, next: NextFunction) {
    console.log(`[${req.method}] ${req.protocol}://${req.hostname}:8000${req.path}`)
    next()
}
const app = express()

app.use(logRequest)
app.use(cookieParser())

app.use('/api/author', [bodyParser.json(), authorRouter])
app.use("/api", [bodyParser.json(), productRouter])


export default app