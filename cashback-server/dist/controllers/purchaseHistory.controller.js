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
exports.fetchAndSaveDataAffiliate = exports.getPurchaseHistory = exports.savePurchaseHistory = void 0;
const purchaseHistory_model_1 = __importDefault(require("../models/purchaseHistory.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const func_1 = require("../ultils/func");
const savePurchaseHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productName, price, productLink, cashbackPercentage, quantity } = req.body;
        if (!productName ||
            !price ||
            !productLink ||
            !cashbackPercentage ||
            !quantity) {
            return res
                .status(400)
                .json({ message: "Please provide all required fields." });
        }
        const purchaseHistory = yield purchaseHistory_model_1.default.create({
            userId: (req === null || req === void 0 ? void 0 : req.user)._id,
            productName,
            price,
            productLink,
            cashbackPercentage,
            quantity,
        });
        res.status(201).json(purchaseHistory);
    }
    catch (error) {
        console.error("Error saving purchase history:", error);
        res.status(500).json({ message: "Server error, please try again later." });
    }
});
exports.savePurchaseHistory = savePurchaseHistory;
const getPurchaseHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = Number(req.query.page) || 1;
        const limit = 20;
        const total = yield purchaseHistory_model_1.default.countDocuments({
            userId: (req === null || req === void 0 ? void 0 : req.user)._id,
        });
        const purchaseHistory = yield purchaseHistory_model_1.default.find({
            userId: (req === null || req === void 0 ? void 0 : req.user)._id,
        })
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip((page - 1) * limit);
        res.json({
            page,
            pages: Math.ceil(total / limit),
            total,
            purchaseHistory,
        });
    }
    catch (error) {
        console.error("Error fetching purchase history:", error);
        res.status(500).json({ message: "Server error, please try again later." });
    }
});
exports.getPurchaseHistory = getPurchaseHistory;
const fetchDataFromAPI = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const { utm_source, merchant, limit, status } = params;
    let apiUrl = "https://api.accesstrade.vn/v1/transactions?";
    apiUrl += `since=2021-01-01T00:00:00Z&until=2026-01-03T00`;
    if (utm_source)
        apiUrl += `&utm_source=${utm_source}`;
    if (merchant)
        apiUrl += `&merchant=${merchant}`;
    if (limit)
        apiUrl += `&limit=${limit}`;
    if (status !== undefined)
        apiUrl += `&status=${status}`;
    const response = yield fetch(apiUrl, {
        headers: {
            Authorization: "Token b2YarfQvCZooDdHSNMIJoQYwawTP_cqY",
        },
    });
    if (!response.ok) {
        console.error("API call failed", response.statusText);
        throw new Error("Failed to fetch data from API");
    }
    return response.json();
});
const saveToDatabase = (data) => __awaiter(void 0, void 0, void 0, function* () {
    for (const item of data) {
        if (item.utm_source) {
            const existingRecord = yield purchaseHistory_model_1.default.findOne({
                transaction_id: item.transaction_id,
            });
            if (!existingRecord) {
                const user = yield user_model_1.default.findById(item.utm_source);
                const newRecord = new purchaseHistory_model_1.default({
                    userId: item.utm_source,
                    productName: item.merchant,
                    price: item.transaction_value,
                    productLink: item.click_url,
                    cashbackPercentage: 0,
                    cashback: item.commission,
                    quantity: item.product_quantity,
                    purchaseDate: new Date(item.transaction_time),
                    transaction_id: item.transaction_id,
                    status: item.status === 1
                        ? "Đã duyệt"
                        : item.status === 0
                            ? "Đang xử lý"
                            : "Hủy",
                });
                yield newRecord.save();
                if (user) {
                    user.money += item.commission;
                    yield user.save();
                }
            }
        }
    }
});
const fetchAndSaveDataAffiliate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user || req.user.role <= 0) {
            return res.status(403).json({ error: "Forbidden: Insufficient role" });
        }
        const { utm_source, merchant, limit, status } = req.body;
        const apiResponse = yield fetchDataFromAPI({
            utm_source: utm_source && `j:"${utm_source}"`,
            merchant,
            limit,
            status,
        });
        const userData = yield Promise.all(apiResponse.data.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            const userId = (0, func_1.extractId)(item.utm_source);
            const user = userId
                ? yield user_model_1.default.findById(userId).select("name email")
                : null;
            return Object.assign(Object.assign({}, item), { userName: (user === null || user === void 0 ? void 0 : user.name) || "Không xác định", email: (user === null || user === void 0 ? void 0 : user.email) || "Không xác định" });
        })));
        const transformedData = apiResponse.data.map((item) => ({
            merchant: item.merchant,
            status: item.status,
            transaction_time: item.transaction_time,
            transaction_value: item.transaction_value,
            product_quantity: item.product_quantity,
            transaction_id: item.transaction_id,
            click_url: item.click_url,
            utm_source: (0, func_1.extractId)(item.utm_source),
            product_price: item.product_price,
            commission: item.commission,
            reason_rejected: item.reason_rejected,
        }));
        yield saveToDatabase(transformedData);
        res.status(200).json({
            total: apiResponse.total,
            userData: userData,
        });
    }
    catch (error) {
        console.error("Error fetching, transforming, or saving data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.fetchAndSaveDataAffiliate = fetchAndSaveDataAffiliate;
