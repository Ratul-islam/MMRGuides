import { Router } from "express";
import { userLoginController, userSignUpControllerTemp } from "./controller.js";

const userRouter = Router();

userRouter.post("/register", userSignUpControllerTemp);
// userRouter.post("/verify-email", verifyUserOtpController);
userRouter.post("/login", userLoginController);
// userRouter.post("/logout", authControllers.studentLogout);


export default userRouter;