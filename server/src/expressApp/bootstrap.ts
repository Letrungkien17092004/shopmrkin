import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser"
import { Request, Response, NextFunction } from "express";
import cors from "cors"
// import router
import authorRouter from "expressApp/routers/AuthorRouter.js";
import productRouter from "./routers/ProductRouter.js";
import variantRouter from "./routers/VariantRouter.js";
import mediaRouter from "./routers/MediaRouter.js";

function logRequest(req: Request, res: Response, next: NextFunction) {
    console.log(`[${req.method}] ${req.protocol}://${req.hostname}:8000${req.path}`)
    next()
}
const app = express()

app.use(cors())
app.use(logRequest)
app.use(cookieParser())

app.use('/api', [bodyParser.json(), authorRouter]) // authorization API
app.use("/api", [bodyParser.json(), productRouter]) // product API
app.use("/api", [bodyParser.json(), variantRouter]) // variant API
app.use("/api", mediaRouter) // media API


export default app