import { Router } from "express";
import { authenticationController } from "../controllers/authentication.controller";
import { authenticationGuard } from "../guards/authentication.guard";
import { authorizationGuard } from "../guards/authorization.guard";
import { RoleEnum } from "../enum";

const router = Router();

router.post("/signup-reader", authenticationController.signupForReader);
router.post("/request-account-verify", authenticationController.sendVerificationLink);
router.post("/verify-account", authenticationController.verifyAccount);
router.post("/login", authenticationController.login);
router.post("/refresh", authenticationController.refresh);

router.use(authenticationGuard())
router.post("/signup-staff", authorizationGuard([RoleEnum.Admin]), authenticationController.signupForReader);
router.post("/logout", authenticationController.logout);

export const authenticationRouter = router;
