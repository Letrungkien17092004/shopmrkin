import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser"
import { Request, Response, NextFunction } from "express";
import cors from "cors"
import path from "path";
// import router
import {
    authorRouter,
    productRouter,
    variantRouter,
    mediaRouter,
    demoRouter,
    cartRouter,
    orderRouter,
    paymentRouter,
    assistantRouter
} from "./routers/index.js"

const PUBLIC_DIR = path.join(process.cwd(), "public")

function logRequest(req: Request, res: Response, next: NextFunction) {
    console.log(`[${req.method}] ${req.protocol}://${req.hostname}:8000${req.path}`)
    next()
}
const app = express()
app.set("trust proxy", true)
app.set('query parser', 'extended');

app.use(cors())
app.use(logRequest)
app.use(cookieParser())
app.use("/public", express.static(PUBLIC_DIR))


app.use('/api', [bodyParser.json(), authorRouter]) // authorization API
app.use("/api", [bodyParser.json(), productRouter]) // product API
app.use("/api", [bodyParser.json(), variantRouter]) // variant API
app.use("/api", mediaRouter) // media API
app.use("/api", demoRouter) // demo API
app.use("/api", [bodyParser.json(), cartRouter]) // cart API
app.use("/api", [bodyParser.json(), orderRouter]) // order API
app.use("/api", [bodyParser.json(), paymentRouter]) // payment API
app.use("/api", [bodyParser.json(), assistantRouter]) // AI chat API


export default app