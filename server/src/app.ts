import app from "./expressApp/bootstrap.js";
import { ENV } from "./config/env.js";
app.listen(ENV.PORT || 8000, () => {
    console.log(`listening at: http://${ENV.SERVER_NAME}:${ENV.PORT}`)
})