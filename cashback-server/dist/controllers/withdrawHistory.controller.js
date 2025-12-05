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
exports.getAllWithdrawHistory = exports.deleteWithdrawHistory = exports.getWithdrawHistory = exports.createWithdraw = void 0;
const withdrawHistory_model_1 = __importDefault(require("../models/withdrawHistory.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const createWithdraw = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bank, money, accountBank, transId } = req.body;
    try {
        if (!bank || !money || !accountBank || !transId) {
            return res.status(400).json({ message: "Missing field" });
        }
        if (!(req === null || req === void 0 ? void 0 : req.user)) {
            return res.status(400).json({ message: "User not found" });
        }
        const user = yield user_model_1.default.findById(req.user._id);
        if (user && (user === null || user === void 0 ? void 0 : user.money) <= 50000) {
            return res.status(400).json({ message: "Not enough money to withdraw" });
        }
        const withdrawHistory = yield withdrawHistory_model_1.default.create({
            userId: req === null || req === void 0 ? void 0 : req.user,
            bank,
            money,
            accountBank,
            transId,
        });
        return res.status(200).json(withdrawHistory);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error" });
    }
});
exports.createWithdraw = createWithdraw;
const getWithdrawHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const withdrawHistory = yield withdrawHistory_model_1.default.find({
            userId: req === null || req === void 0 ? void 0 : req.user,
        }).sort({ withdrawDate: -1 });
        if (!withdrawHistory || withdrawHistory.length === 0) {
            return res.status(404).json({ message: "No data" });
        }
        return res.status(200).json(withdrawHistory);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error" });
    }
});
exports.getWithdrawHistory = getWithdrawHistory;
const deleteWithdrawHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const withdrawHistory = yield withdrawHistory_model_1.default.findById(req.params.id);
        if (!withdrawHistory) {
            return res.status(404).json({ message: "No data" });
        }
        if (withdrawHistory.userId.toString() !== (req === null || req === void 0 ? void 0 : req.user).toString()) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        yield withdrawHistory.remove();
        return res.status(200).json({ message: "Success" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error" });
    }
});
exports.deleteWithdrawHistory = deleteWithdrawHistory;
const getAllWithdrawHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentUser = yield user_model_1.default.findById(req.user._id).select("role");
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }
        if ((currentUser === null || currentUser === void 0 ? void 0 : currentUser.role) <= 0) {
            return res.status(403).json({ message: "Permission denied" });
        }
        const { search, page = 1, limit = 10 } = req.query;
        const filter = {};
        if (search) {
            const searchRegex = new RegExp(search, "i");
            const users = yield user_model_1.default.find({
                $or: [{ email: searchRegex }, { accountBank: searchRegex }],
            }).select("_id");
            const userIds = users.map((user) => user._id);
            if (userIds.length > 0) {
                filter.userId = { $in: userIds };
            }
            else {
                return res.status(200).json({ data: [], total: 0 });
            }
        }
        const skip = (Number(page) - 1) * Number(limit);
        const [withdrawHistories, total] = yield Promise.all([
            withdrawHistory_model_1.default.find(filter)
                .populate("userId", "email accountBank")
                .sort({ withdrawDate: -1 })
                .skip(skip)
                .limit(Number(limit)),
            withdrawHistory_model_1.default.countDocuments(filter),
        ]);
        res.status(200).json({
            data: withdrawHistories,
            total,
            page: Number(page),
            limit: Number(limit),
        });
    }
    catch (error) {
        console.error("Error fetching withdraw history:", error);
        res.status(500).json({ message: "Server error, please try again later." });
    }
});
exports.getAllWithdrawHistory = getAllWithdrawHistory;
