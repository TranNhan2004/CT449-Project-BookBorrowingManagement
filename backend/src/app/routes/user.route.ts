import { Router } from "express";
import { userController } from "../controllers/user.controller";

const router = Router();

router.get("/readers", userController.findAllReader);
router.get("/staffs-or-admins", userController.findAllStaffOrAdmin);

router.put("/:id/info", userController.updateUserInfo);
router.put("/:id/password", userController.updatePassword);
router.post("/request-password-reset", userController.requestPasswordReset);
router.post("/reset-password", userController.resetPassword);
router.get("/:id", userController.findById);
router.delete("/:id", userController.delete);

export const userRouter = router;
