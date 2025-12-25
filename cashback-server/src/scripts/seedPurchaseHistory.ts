import mongoose from "mongoose";
import dotenv from "dotenv";
import PurchaseHistory from "../models/purchaseHistory.model";
import User from "../models/user.model";

dotenv.config();

const PRODUCT_NAMES = [
  "iPhone 15 Pro Max",
  "Samsung Galaxy S24 Ultra",
  "MacBook Pro M3",
  "iPad Air 5",
  "AirPods Pro 2",
  "Apple Watch Series 9",
  "Sony WH-1000XM5",
  "Dell XPS 15",
  "Nintendo Switch OLED",
  "PlayStation 5",
  "Xbox Series X",
  "Dyson V15 Detect",
  "LG OLED TV 65 inch",
  "Xiaomi Robot Vacuum",
  "GoPro Hero 12",
  "Canon EOS R6",
  "Kindle Paperwhite",
  "Bose QuietComfort",
  "Logitech MX Master 3",
  "Samsung Galaxy Tab S9",
];

const STATUSES: ("Đang xử lý" | "Đã duyệt" | "Hủy")[] = [
  "Đang xử lý",
  "Đã duyệt",
  "Hủy",
];

const VOUCHER_CODES = [
  "SAVE10",
  "SUMMER20",
  "FLASH15",
  "VIP25",
  "NEWUSER30",
  null,
  null,
  null,
];

// Helper functions
const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomFloat = (min: number, max: number) =>
  Math.random() * (max - min) + min;

const randomElement = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

const randomDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - randomInt(0, daysAgo));
  date.setHours(randomInt(0, 23), randomInt(0, 59), randomInt(0, 59));
  return date;
};

const generateTransactionId = () => {
  return `TXN${Date.now()}${randomInt(1000, 9999)}`;
};

const seedPurchaseHistory = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "");
    console.log("Connected to MongoDB");

    // Lấy danh sách user IDs từ database
    const users = await User.find({}).select("_id").limit(20);
    if (users.length === 0) {
      console.log("Không có user nào trong database. Tạo user trước.");
      process.exit(1);
    }

    const userIds = users.map((u: any) => u._id.toString());
    console.log(`Found ${userIds.length} users`);

    const purchases = [];

    for (let i = 0; i < 100; i++) {
      const price = randomInt(100000, 50000000); // 100k - 50M
      const cashbackPercentage = randomFloat(1, 10); // 1% - 10%
      const quantity = randomInt(1, 5);

      // Random membership bonus (0%, 1%, 2%, 3%)
      const membershipBonusPercent = randomElement([0, 0, 0, 1, 1, 2, 3]);
      const baseCashback = (price * cashbackPercentage) / 100;
      const membershipBonusAmount =
        membershipBonusPercent > 0
          ? (price * membershipBonusPercent) / 100
          : 0;

      // Random voucher
      const voucherCode = randomElement(VOUCHER_CODES);
      const voucherUsed = voucherCode !== null;
      const voucherBonusPercent = voucherUsed ? randomInt(5, 30) : 0;
      const bonusCashback = voucherUsed
        ? (price * voucherBonusPercent) / 100
        : 0;

      // Tổng cashback
      const totalCashback = baseCashback + membershipBonusAmount + bonusCashback;

      // Random status với tỉ lệ: 60% Đã duyệt, 25% Đang xử lý, 15% Hủy
      const statusRandom = Math.random();
      let status: "Đang xử lý" | "Đã duyệt" | "Hủy";
      if (statusRandom < 0.6) {
        status = "Đã duyệt";
      } else if (statusRandom < 0.85) {
        status = "Đang xử lý";
      } else {
        status = "Hủy";
      }

      const purchase = {
        userId: randomElement(userIds),
        productName: randomElement(PRODUCT_NAMES),
        price: price,
        productLink: `https://shop.example.com/product/${randomInt(1000, 9999)}`,
        cashbackPercentage: parseFloat(cashbackPercentage.toFixed(2)),
        cashback: Math.round(totalCashback),
        quantity: quantity,
        purchaseDate: randomDate(90), // Random trong 90 ngày qua
        status: status,
        transaction_id: generateTransactionId(),
        membershipBonusPercent: membershipBonusPercent,
        membershipBonusAmount: Math.round(membershipBonusAmount),
        voucherUsed: voucherUsed,
        voucherCode: voucherCode,
        voucherBonusPercent: voucherBonusPercent,
        bonusCashback: Math.round(bonusCashback),
      };

      purchases.push(purchase);
    }

    // Insert tất cả
    const result = await PurchaseHistory.insertMany(purchases);
    console.log(`Successfully inserted ${result.length} purchase records`);

    // Thống kê
    const stats = {
      total: result.length,
      approved: result.filter((p) => p.status === "Đã duyệt").length,
      pending: result.filter((p) => p.status === "Đang xử lý").length,
      cancelled: result.filter((p) => p.status === "Hủy").length,
      withVoucher: result.filter((p) => p.voucherUsed).length,
      withMembershipBonus: result.filter((p) => p.membershipBonusPercent > 0)
        .length,
    };

    console.log("\n=== Statistics ===");
    console.log(`Total: ${stats.total}`);
    console.log(`Đã duyệt: ${stats.approved}`);
    console.log(`Đang xử lý: ${stats.pending}`);
    console.log(`Hủy: ${stats.cancelled}`);
    console.log(`With Voucher: ${stats.withVoucher}`);
    console.log(`With Membership Bonus: ${stats.withMembershipBonus}`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedPurchaseHistory();
