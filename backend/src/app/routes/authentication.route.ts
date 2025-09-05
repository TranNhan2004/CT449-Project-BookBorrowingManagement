import { Router } from "express";
import { authenticationController } from "../controllers/authentication.controller";

const router = Router();

router.post("/signup", authenticationController.signup);
router.post("/request-account-verify", authenticationController.sendVerificationLink);
router.post("/verify-account", authenticationController.verifyAccount);
router.post("/login", authenticationController.login);
router.post("/refresh", authenticationController.refresh);
router.post("/logout", authenticationController.logout);

export const authenticationRouter = router;
