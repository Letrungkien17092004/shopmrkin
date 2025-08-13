import express from "express";
import authorRouter from "expressApp/routers/AuthorRouter";
import bodyParser from "body-parser";
import { Request, Response, NextFunction } from "express";
function logRequest(req: Request, res: Response, next: NextFunction) {
    console.log(`[${req.method}] ${req.protocol}://${req.hostname}:8000${req.path}`)
    next()
}
const app = express()
app.use(logRequest)
app.use('/api/author', [bodyParser.json(), authorRouter])


export default app