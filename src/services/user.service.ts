import configureExpressApp from "../utils/setupExpress";
import { userRouter } from "../routes/user.routes";
const app = configureExpressApp();
import { config } from '../config';
import { registerUser } from "../controllers/user.controller";
import { Request, Response, NextFunction } from "express";

app.post("/register", registerUser)


app.listen(config.USER_PORT, () => {
    console.log(`User service listening on port ${config.USER_PORT}`);
})



