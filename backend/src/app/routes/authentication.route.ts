import { Router } from "express";
import { authenticationController } from "../controllers/authentication.controller";

const router = Router();

router.post("/signup", authenticationController.signup.bind(authenticationController));
router.post("/login", authenticationController.login.bind(authenticationController));
router.post("/refresh", authenticationController.refresh.bind(authenticationController));
router.post("/logout", authenticationController.logout.bind(authenticationController));

export const authenticationRouter = router;
