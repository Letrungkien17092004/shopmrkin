import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser"
import { Request, Response, NextFunction } from "express";

// import router
import authorRouter from "expressApp/routers/AuthorRouter.js";
import productRouter from "./routers/ProductRouter.js";
import variantRouter from "./routers/VariantRouter.js";

function logRequest(req: Request, res: Response, next: NextFunction) {
    console.log(`[${req.method}] ${req.protocol}://${req.hostname}:8000${req.path}`)
    next()
}
const app = express()

app.use(logRequest)
app.use(cookieParser())

app.use('/api/author', [bodyParser.json(), authorRouter]) // authorization API
app.use("/api", [bodyParser.json(), productRouter]) // product API
app.use("/api", [bodyParser.json(), variantRouter]) // variant API


export default app