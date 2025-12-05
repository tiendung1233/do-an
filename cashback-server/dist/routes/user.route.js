"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_1 = require("../middleware/auth");
const lucktyWheel_controller_1 = require("../controllers/lucktyWheel.controller");
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
// Multer config for file upload
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
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
        }
        else {
            cb(new Error("Invalid file type. Only CSV and Excel files are allowed."));
        }
    },
});
router.put("/profile", auth_1.protect, user_controller_1.updateUserProfile);
router.put("/change-password", auth_1.protect, user_controller_1.changePassword);
router.get("/", auth_1.protect, user_controller_1.getUserProfile);
router.post("/forgot-password", user_controller_1.forgotPassword);
router.post("/reset-password", user_controller_1.resetPassword);
router.post("/spin", auth_1.protect, lucktyWheel_controller_1.startSpin);
router.post("/prize", auth_1.protect, lucktyWheel_controller_1.claimPrize);
router.post("/admin-create-users", auth_1.protect, user_controller_1.createUser);
router.put("/admin-update-users/:userId", auth_1.protect, user_controller_1.updateUser);
router.delete("/admin-del-users/:userId", auth_1.protect, user_controller_1.deleteUser);
router.get("/admin-all-user", auth_1.protect, user_controller_1.getAllUserProfile);
router.post("/admin-import-users", auth_1.protect, upload.single("file"), user_controller_1.importUsers);
router.get("/admin-import-template", auth_1.protect, user_controller_1.downloadImportTemplate);
exports.default = router;
