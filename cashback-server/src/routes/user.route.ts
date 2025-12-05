import { Router } from "express";
import {
  changePassword,
  createUser,
  deleteUser,
  forgotPassword,
  getAllUserProfile,
  getUserProfile,
  resetPassword,
  updateUser,
  updateUserProfile,
  importUsers,
  downloadImportTemplate,
} from "../controllers/user.controller";
import { protect } from "../middleware/auth";
import { claimPrize, startSpin } from "../controllers/lucktyWheel.controller";
import multer from "multer";

const router = Router();

// Multer config for file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
      "application/vnd.ms-excel", // xls
      "text/csv", // csv
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only CSV and Excel files are allowed."));
    }
  },
});

router.put("/profile", protect, updateUserProfile);
router.put("/change-password", protect, changePassword);
router.get("/", protect, getUserProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/spin", protect, startSpin);
router.post("/prize", protect, claimPrize);
router.post("/admin-create-users", protect, createUser);
router.put("/admin-update-users/:userId", protect, updateUser);
router.delete("/admin-del-users/:userId", protect, deleteUser);
router.get("/admin-all-user", protect, getAllUserProfile);
router.post("/admin-import-users", protect, upload.single("file"), importUsers);
router.get("/admin-import-template", protect, downloadImportTemplate);

export default router;
