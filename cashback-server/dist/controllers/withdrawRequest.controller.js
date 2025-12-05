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
exports.approveWithdrawRequest = exports.getAllWithdrawRequests = exports.verifyWithdraw = exports.requestWithdraw = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const withdrawRequest_1 = require("../models/withdrawRequest");
const withdrawHistory_model_1 = __importDefault(require("../models/withdrawHistory.model"));
const func_1 = require("../ultils/func");
const sendEmail_1 = require("../ultils/sendEmail");
const requestWithdraw = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, amount } = req.body;
    try {
        const user = yield user_model_1.default.findById(userId);
        if (!user)
            return res.status(404).json({ message: "User not found" });
        if (user.money < 50000) {
            return res
                .status(400)
                .json({ message: "Số dư không đủ để thực hiện yêu cầu rút tiền" });
        }
        if (user.money < Number(amount)) {
            return res.status(400).json({ message: "Yêu cầu không hợp lệ" });
        }
        const verificationCode = (0, func_1.getRandomInt)(1000000).toString();
        const expiresAt = new Date(Date.now() + 60 * 1000);
        yield withdrawRequest_1.WithdrawRequest.create({
            userId: user._id,
            amount,
            verificationCode,
            expiresAt,
            status: "pending",
            isVerify: false,
        });
        yield (0, sendEmail_1.sendEmailWithdrawRequest)(user.email, `Mã xác thực của bạn là: ${verificationCode}`);
        res.json({ message: "Đã gửi mã xác thực qua email" });
    }
    catch (error) {
        res.status(500).json({ message: "Lỗi hệ thống", error });
    }
});
exports.requestWithdraw = requestWithdraw;
const verifyWithdraw = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, verificationCode } = req.body;
    try {
        const request = yield withdrawRequest_1.WithdrawRequest.findOne({
            userId,
            verificationCode,
        });
        const user = yield user_model_1.default.findById(userId);
        if (!user)
            return res.status(404).json({ message: "Yêu cầu không tồn tại" });
        if (!request)
            return res.status(404).json({ message: "Yêu cầu không tồn tại" });
        if (new Date() > request.expiresAt)
            return res.status(400).json({ message: "Mã xác thực đã hết hạn" });
        request.isVerify = true;
        yield request.save();
        yield user_model_1.default.updateOne({ _id: userId }, { money: Number(user.money) - Number(request.amount) });
        res.json({
            message: "Xác thực thành công, yêu cầu đang chờ duyệt",
            status: "success",
        });
    }
    catch (error) {
        res.status(500).json({ message: "Lỗi hệ thống", error });
    }
});
exports.verifyWithdraw = verifyWithdraw;
const getAllWithdrawRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user || req.user.role <= 0) {
            return res.status(403).json({ error: "Forbidden: Insufficient role" });
        }
        const { search } = req.query;
        let filter = { isVerify: true };
        if (search) {
            const users = yield user_model_1.default.find({
                $or: [
                    { email: { $regex: search, $options: "i" } },
                    { phone: { $regex: search, $options: "i" } },
                    { bankAccount: { $regex: search, $options: "i" } },
                ],
            }).select("_id");
            const userIds = users.map((user) => user._id);
            filter.userId = { $in: userIds };
        }
        const withdrawRequests = yield withdrawRequest_1.WithdrawRequest.find(filter)
            .populate("userId", "name email phone bankAccount")
            .sort({ createdAt: -1 });
        res.status(200).json(withdrawRequests);
    }
    catch (error) {
        console.error("Error getting withdraw requests:", error);
        res.status(500).json({ message: "Server error, please try again later." });
    }
});
exports.getAllWithdrawRequests = getAllWithdrawRequests;
const approveWithdrawRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!req.user || req.user.role <= 0) {
            return res.status(403).json({ error: "Forbidden: Insufficient role" });
        }
        const currentUser = yield user_model_1.default.findById(req.user._id);
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }
        const withdrawRequest = yield withdrawRequest_1.WithdrawRequest.findById(id);
        if (!withdrawRequest) {
            return res.status(404).json({ message: "Withdraw request not found" });
        }
        if (!withdrawRequest.isVerify) {
            return res.status(400).json({
                message: `Cannot update withdraw request"`,
            });
        }
        if (withdrawRequest.status !== "pending") {
            return res.status(400).json({
                message: `Cannot update withdraw request with status "${withdrawRequest.status}"`,
            });
        }
        withdrawRequest.status = status;
        yield withdrawRequest.save();
        if (status === "rejected") {
            currentUser.money = currentUser.money + withdrawRequest.amount;
            (0, sendEmail_1.sendEmailWithdrawRequest)(currentUser.email, "Yêu cầu của bạn đã bị từ chối, vui lòng liên hệ nhân viên nếu cần hỗ trợ");
        }
        if (status === "approved") {
            currentUser.total += Number(withdrawRequest.amount);
            yield withdrawHistory_model_1.default.create({
                userId: currentUser.id,
                bank: currentUser.bankName,
                money: withdrawRequest.amount,
                accountBank: currentUser.accountBank,
                transId: withdrawRequest._id,
            });
            (0, sendEmail_1.sendEmailWithdrawRequest)(currentUser.email, `Yêu cầu của bạn đã được chấp thuận, số tiền ${withdrawRequest.amount}Đ đã được chuyển về tài khoản ngân hàng của bạn`);
        }
        yield currentUser.save();
        res.status(200).json({
            message: `Withdraw request has been ${status} successfully`,
            withdrawRequest,
        });
    }
    catch (error) {
        console.error("Error approving withdraw request:", error);
        res.status(500).json({ message: "Server error, please try again later." });
    }
});
exports.approveWithdrawRequest = approveWithdrawRequest;
