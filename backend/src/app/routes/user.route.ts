import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { authenticationGuard } from "../guards/authentication.guard";
import { authorizationGuard } from "../guards/authorization.guard";
import { RoleEnum } from "../enum";
import { validateIdGuard } from "../guards/validateId.guard";

const router = Router();

router.post("/request-password-reset", userController.requestPasswordReset);
router.post("/reset-password", userController.resetPassword);

router.use(authenticationGuard());
router.put("/:id/info", validateIdGuard(), userController.updateUserInfo);
router.put("/:id/password", validateIdGuard(), userController.updatePassword);
router.get("/:id", validateIdGuard(), userController.findById);

router.use(authorizationGuard([RoleEnum.Admin]))
router.get("/readers", userController.findAllReader);
router.get("/staffs-or-admins", userController.findAllStaffOrAdmin);
router.delete("/:id", validateIdGuard(), userController.delete);

export const userRouter = router;
