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
exports.resendVerificationCode = exports.verifyEmailToken = exports.logout = exports.authUser = exports.registerUser = exports.verifyToken = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const generateToken_1 = __importDefault(require("../ultils/generateToken"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const blackList_model_1 = __importDefault(require("../models/blackList.model"));
const validator_1 = __importDefault(require("validator"));
const sendEmail_1 = require("../ultils/sendEmail");
const verifyToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = req.body.token;
    if (!token) {
        return res.status(400).json({ valid: false, message: "Token is required" });
    }
    try {
        const blacklistedToken = yield blackList_model_1.default.findOne({ token });
        if (blacklistedToken) {
            return res.status(401).json({ message: "Token is revoked" });
        }
        const role = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        return res.status(200).json({ valid: true, user: decoded, role });
    }
    catch (error) {
        return res
            .status(401)
            .json({ valid: false, message: "Invalid or expired token" });
    }
});
exports.verifyToken = verifyToken;
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, name, accountBank } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({
                message: "Please provide all required fields: email, password, name.",
            });
        }
        if (!validator_1.default.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email format." });
        }
        const userExists = yield user_model_1.default.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }
        const user = yield user_model_1.default.create({
            email,
            password,
            name,
            accountBank,
            isVerified: false,
        });
        if (user) {
            const verificationToken = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
            yield (0, sendEmail_1.sendVerificationEmail)(email, verificationToken);
            res.status(201).json({
                success: true,
                message: "User registered. Please verify your email to log in.",
            });
        }
        else {
            res.status(400).json({ message: "Invalid user data" });
        }
    }
    catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: "Server error, please try again later." });
    }
});
exports.registerUser = registerUser;
const authUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Please provide both email and password." });
        }
        const user = yield user_model_1.default.findOne({ email });
        if (user && (yield user.comparePassword(password))) {
            if (!user.isVerified) {
                return res
                    .status(401)
                    .json({ message: "Please verify your email first." });
            }
            res.json({
                _id: user._id,
                email: user.email,
                token: (0, generateToken_1.default)(user._id),
            });
        }
        else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    }
    catch (error) {
        console.error("Error during authentication:", error);
        res.status(500).json({ message: "Server error, please try again later." });
    }
});
exports.authUser = authUser;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ success: false, message: "Token required" });
    }
    try {
        const decoded = jsonwebtoken_1.default.decode(token);
        const expirationDate = new Date(decoded.exp * 1000);
        yield blackList_model_1.default.create({
            token,
            expirationDate,
        });
        res.status(200).json({ success: true, message: "Token revoked" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Error revoking token" });
    }
});
exports.logout = logout;
const verifyEmailToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ message: "Verification token is required." });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = yield user_model_1.default.findById(decoded.userId);
        if (!user) {
            return res.status(400).json({ message: "Invalid verification token." });
        }
        if (user.isVerified) {
            return res.status(400).json({ message: "User already registered" });
        }
        user.isVerified = true;
        yield user.save();
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
        res.status(201).json({
            _id: user._id,
            email: user.email,
            name: user.name,
            accountBank: user.accountBank,
            token: (0, generateToken_1.default)(user._id),
        });
    }
    catch (error) {
        res.status(400).json({ message: "Invalid or expired token." });
    }
});
exports.verifyEmailToken = verifyEmailToken;
const resendVerificationCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const now = new Date();
        const isSameDay = user.lastVerificationRequest &&
            now.toDateString() ===
                new Date(user.lastVerificationRequest).toDateString();
        if (isSameDay && (user === null || user === void 0 ? void 0 : user.verificationRequestsCount) >= 2) {
            return res
                .status(429)
                .json({ message: "Daily limit reached for verification emails." });
        }
        if (!isSameDay) {
            user.verificationRequestsCount = 0;
        }
        const verificationToken = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        yield (0, sendEmail_1.sendVerificationEmail)(email, verificationToken);
        user.verificationRequestsCount += 1;
        user.lastVerificationRequest = now;
        yield user.save();
        res.status(200).json({ message: "Verification code resent successfully." });
    }
    catch (error) {
        console.error("Error resending verification code:", error);
        res.status(500).json({ message: "Server error, please try again later." });
    }
});
exports.resendVerificationCode = resendVerificationCode;
