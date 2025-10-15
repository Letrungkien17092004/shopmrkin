import app from "./expressApp/bootstrap.js";
import { ENV } from "./config/env.js";
app.listen(ENV.PORT, () => {
    console.log("listening at: http://localhost:8000")
})