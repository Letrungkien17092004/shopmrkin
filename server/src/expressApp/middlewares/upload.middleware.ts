import crypto from "crypto"
import multer from "multer";
import path from "path"
import { ENV } from "config/env.js";

// path config
const __dirname = import.meta.dirname
const uploadPath = path.resolve(__dirname, `../../../${ENV.UPLOAD_FOLDER}`)


// storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath)
    },
    filename: (req, file, cb) => {
        const fileExtention = file.originalname.split(".").at(-1)
        const uniqueSuffix = `${crypto.randomUUID().replaceAll("-", "")}-${Date.now()}`

        cb(null, `${uniqueSuffix}.${fileExtention}`)
    }
})

export default multer({
    storage: storage
})





