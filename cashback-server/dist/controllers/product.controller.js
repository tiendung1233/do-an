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
exports.deleteProduct = exports.updateProduct = exports.addProduct = exports.getCounts = exports.getShops = exports.getProductById = exports.getProducts = void 0;
const googleapis_1 = require("googleapis");
const google_auth_library_1 = require("google-auth-library");
const user_model_1 = __importDefault(require("../models/user.model"));
const func_1 = require("../ultils/func");
const PRIVATE_KEY = (process.env.GOOGLE_PRIVATE_KEY ||
    "GOOGLE_PRIVATE_KEY").replace(/\\n/g, "\n");
const CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const removeDiacritics = (str) => {
    var _a, _b;
    return (_b = (_a = str === null || str === void 0 ? void 0 : str.trim()) === null || _a === void 0 ? void 0 : _a.normalize("NFD")) === null || _b === void 0 ? void 0 : _b.replace(/[\u0300-\u036f]/g, "");
};
const parsePrice = (priceStr) => {
    const priceRange = priceStr.split("-");
    return parseFloat(priceRange[0].trim());
};
const authClient = new google_auth_library_1.JWT({
    email: CLIENT_EMAIL,
    key: PRIVATE_KEY,
    keyFile: "./google.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const sheetName = req.query.sheetName || "Tất cả";
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const searchTerm = req.query.searchTerm
            ? removeDiacritics((_a = req.query.searchTerm.toLowerCase()) === null || _a === void 0 ? void 0 : _a.trim())
            : "";
        const shopName = req.query.shopName
            ? removeDiacritics((_b = req.query.shopName.toLowerCase()) === null || _b === void 0 ? void 0 : _b.trim())
            : "";
        const sort = req.query.sort || "sales";
        const sheets = googleapis_1.google.sheets({ version: "v4", auth: authClient });
        const startRow = (page - 1) * limit + 2; // Sheets are 1-indexed, not 0-indexed
        const endRow = startRow + limit - 1;
        const range = `${sheetName}!A${startRow}:G${endRow}`; // Adjust A:G to your actual data range
        const sheetResponse = yield sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: range,
        });
        if (!sheetResponse.data.values) {
            throw new Error(`No data found in sheet "${sheetName}".`);
        }
        const rows = sheetResponse.data.values;
        let filteredData = rows.filter((row) => {
            var _a, _b, _c, _d;
            const productName = removeDiacritics((_b = (_a = row[0]) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === null || _b === void 0 ? void 0 : _b.trim());
            const shop = removeDiacritics((_d = (_c = row[5]) === null || _c === void 0 ? void 0 : _c.toLowerCase()) === null || _d === void 0 ? void 0 : _d.trim());
            const matchesProduct = productName === null || productName === void 0 ? void 0 : productName.includes(searchTerm);
            const matchesShop = shop === null || shop === void 0 ? void 0 : shop.includes(shopName || searchTerm);
            if (shopName)
                return matchesShop;
            return matchesProduct || matchesShop;
        });
        const result = filteredData.map((row) => ({
            name: row[0],
            price: row[1],
            link: row[2],
            commission: row[3],
            sales: row[4],
            shop: row[5],
            img: row[6],
        }));
        const parseSales = (salesStr) => {
            if (!salesStr)
                return 0;
            const trimmedStr = salesStr.trim().replace(/,/g, ".");
            const lastChar = trimmedStr.slice(-1).toLowerCase();
            if (lastChar === "k") {
                return parseFloat(trimmedStr.slice(0, -1)) * 1000;
            }
            else if (lastChar === "m") {
                return parseFloat(trimmedStr.slice(0, -1)) * 1000000;
            }
            else {
                return parseFloat(trimmedStr);
            }
        };
        if (sort === "price-asc") {
            result.sort((a, b) => parsePrice(a["price"]) - parsePrice(b["price"]));
        }
        else if (sort === "price-desc") {
            result.sort((a, b) => parsePrice(b["price"]) - parsePrice(a["price"]));
        }
        else if (sort === "sales") {
            result.sort((a, b) => parseSales(b["sales"]) - parseSales(a["sales"]));
        }
        res.json({
            currentPage: page,
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getProducts = getProducts;
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sheetName = req.query.sheetName || "Tất cả";
        const productId = req.params.id;
        const sheets = googleapis_1.google.sheets({ version: "v4", auth: authClient });
        const range = `${sheetName}!A2:G`;
        const sheetResponse = yield sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: range,
        });
        if (!sheetResponse.data.values) {
            throw new Error(`No data found in sheet "${sheetName}".`);
        }
        const rows = sheetResponse.data.values;
        const product = rows.find((row) => {
            const link = row[2];
            return (0, func_1.removeHttps)(link) === productId;
        });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        const result = {
            name: product[0],
            price: product[1],
            link: product[2],
            commission: product[3],
            sales: product[4],
            shop: product[5],
            img: product[6],
        };
        return res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getProductById = getProductById;
const getShops = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const sheetName = req.query.sheetName || "Tất cả";
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const searchTerm = req.query.searchTerm
            ? removeDiacritics((_a = req.query.searchTerm.toLowerCase()) === null || _a === void 0 ? void 0 : _a.trim())
            : "";
        const sheets = googleapis_1.google.sheets({ version: "v4", auth: authClient });
        const range = `${sheetName}!A2:G`;
        const sheetResponse = yield sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: range,
        });
        if (!sheetResponse.data.values) {
            throw new Error(`No data found in sheet "${sheetName}".`);
        }
        const rows = sheetResponse.data.values;
        const shopData = rows.reduce((acc, row) => {
            var _a, _b;
            const shop = removeDiacritics((_b = (_a = row[5]) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === null || _b === void 0 ? void 0 : _b.trim());
            const product = {
                name: row[0],
                commission: parseFloat(row[3]) + 1,
                img: row[6],
            };
            if (shop) {
                if (!acc[shop]) {
                    acc[shop] = [];
                }
                acc[shop].push(product);
            }
            return acc;
        }, {});
        let shops = Object.keys(shopData)
            .filter((shop) => shop.includes(searchTerm))
            .map((shop) => {
            const products = shopData[shop];
            const firstProduct = products[0];
            return {
                shop: shop,
                firstProductImg: (firstProduct === null || firstProduct === void 0 ? void 0 : firstProduct.img) || "",
                firstProductCommission: (firstProduct === null || firstProduct === void 0 ? void 0 : firstProduct.commission) || 0,
            };
        });
        const totalShops = shops.length;
        const startIndex = (page - 1) * limit;
        const endIndex = Math.min(startIndex + limit, totalShops);
        const paginatedShops = shops.slice(startIndex, endIndex);
        res.json({
            currentPage: page,
            totalPages: Math.ceil(totalShops / limit),
            totalShops,
            shops: paginatedShops,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getShops = getShops;
const getCounts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user || req.user.role <= 0) {
            return res.status(403).json({ error: "Forbidden: Insufficient role" });
        }
        const sheetName = req.query.sheetName || "Tất cả";
        const sheets = googleapis_1.google.sheets({ version: "v4", auth: authClient });
        const range = `${sheetName}!A2:G`;
        const sheetResponse = yield sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: range,
        });
        if (!sheetResponse.data.values) {
            throw new Error(`No data found in sheet "${sheetName}".`);
        }
        const rows = sheetResponse.data.values;
        const productCount = rows.length;
        const userCount = yield user_model_1.default.countDocuments({});
        const shopSet = new Set();
        rows.forEach((row) => {
            var _a, _b;
            const shopName = removeDiacritics((_b = (_a = row[5]) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === null || _b === void 0 ? void 0 : _b.trim());
            if (shopName) {
                shopSet.add(shopName);
            }
        });
        const shopCount = shopSet.size;
        res.json({
            productCount,
            shopCount,
            userCount,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getCounts = getCounts;
const sheets = googleapis_1.google.sheets({ version: "v4", auth: authClient });
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sheetName = req.body.sheetName || "Tất cả";
        const product = req.body;
        if (!product.name || !product.price || !product.link) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const range = `${sheetName}!A:G`;
        yield sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range,
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [
                    [
                        product.name,
                        product.price,
                        product.link,
                        product.commission || "",
                        product.sales || "",
                        product.shop || "",
                        product.img || "",
                    ],
                ],
            },
        });
        res.status(201).json({ message: "Product added successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.addProduct = addProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sheetName = req.body.sheetName || "Tất cả";
        const productId = req.params.id;
        const updatedData = req.body;
        const range = `${sheetName}!A2:G`;
        const sheetResponse = yield sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range,
        });
        if (!sheetResponse.data.values) {
            return res.status(404).json({ message: "No data found" });
        }
        const rows = sheetResponse.data.values;
        const rowIndex = rows.findIndex((row) => (0, func_1.removeHttps)(row[2]) === productId);
        if (rowIndex === -1) {
            return res.status(404).json({ message: "Product not found" });
        }
        const updatedRow = [
            updatedData.name || rows[rowIndex][0],
            updatedData.price || rows[rowIndex][1],
            updatedData.link || rows[rowIndex][2],
            updatedData.commission || rows[rowIndex][3],
            updatedData.sales || rows[rowIndex][4],
            updatedData.shop || rows[rowIndex][5],
            updatedData.img || rows[rowIndex][6],
        ];
        const updateRange = `${sheetName}!A${rowIndex + 2}:G${rowIndex + 2}`;
        yield sheets.spreadsheets.values.update({
            spreadsheetId: SHEET_ID,
            range: updateRange,
            valueInputOption: "USER_ENTERED",
            requestBody: { values: [updatedRow] },
        });
        res.json({ message: "Product updated successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sheetName = req.query.sheetName || "Tất cả";
        const productId = req.params.id;
        const range = `${sheetName}!A2:G`;
        const sheetResponse = yield sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range,
        });
        if (!sheetResponse.data.values) {
            return res.status(404).json({ message: "No data found" });
        }
        const rows = sheetResponse.data.values;
        const rowIndex = rows.findIndex((row) => (0, func_1.removeHttps)(row[2]) === productId);
        if (rowIndex === -1) {
            return res.status(404).json({ message: "Product not found" });
        }
        const emptyRow = ["", "", "", "", "", "", ""];
        rows[rowIndex] = emptyRow;
        yield sheets.spreadsheets.values.update({
            spreadsheetId: SHEET_ID,
            range,
            valueInputOption: "USER_ENTERED",
            requestBody: { values: rows },
        });
        res.json({ message: "Product deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: error.message });
    }
});
exports.deleteProduct = deleteProduct;
