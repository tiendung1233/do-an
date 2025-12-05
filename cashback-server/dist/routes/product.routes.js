"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("../controllers/product.controller");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get("/", product_controller_1.getProducts);
router.get("/admin-product", auth_1.protect, product_controller_1.getCounts);
router.post("/admin-add-product", auth_1.protect, product_controller_1.addProduct);
router.put("/admin-edit-product/:id", auth_1.protect, product_controller_1.updateProduct);
router.delete("/admin-del-product/:id", auth_1.protect, product_controller_1.deleteProduct);
router.get("/:id", product_controller_1.getProductById);
exports.default = router;
