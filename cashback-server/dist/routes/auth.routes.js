"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const auth_controller_1 = require("../controllers/auth.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post("/register", auth_controller_1.registerUser);
router.post("/login", auth_controller_1.authUser);
router.post("/logout", auth_controller_1.logout);
router.post("/verify-token", auth_1.protect, auth_controller_1.verifyToken);
router.post("/verify-account", auth_controller_1.verifyEmailToken);
router.post("/resend-verify", auth_controller_1.resendVerificationCode);
router.get("/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport_1.default.authenticate("google", { failureRedirect: "/login" }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        res.cookie("authToken", user.token, {
            path: "/",
        });
        res.cookie("email", user.email, {
            path: "/",
        });
        res.cookie("id", user._id, {
            path: "/",
        });
        res.cookie("user_name", user.name, {
            path: "/",
        });
        // Populate data to chat app
        const data = {
            username: user.email,
            password: "12345678",
            email: user.email,
            isAvatarImageSet: true,
            avatarImage: `https://api.multiavatar.com/${Math.round(Math.random() * 1000)}`,
        };
        try {
            yield fetch("http://localhost:5001/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
        }
        catch (error) {
            console.log("error", error);
        }
        res.redirect("http://localhost:3000/profile");
    }
    else {
        res.redirect("http://localhost:3000/login");
    }
}));
exports.default = router;
