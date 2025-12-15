/**
 * Migration Script: Generate referral codes cho tất cả user cũ chưa có mã
 *
 * Chạy script: npx ts-node src/scripts/generateReferralCodes.ts
 */

import mongoose from "mongoose";
import User, { generateReferralCode } from "../models/user.model";
import dotenv from "dotenv";
import path from "path";

// Load .env từ thư mục gốc của project
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const MONGODB_URI = process.env.MONGO_URI || "mongodb://localhost:27017/cashback";

async function generateUniqueReferralCode(): Promise<string> {
  let code = generateReferralCode();
  let attempts = 0;
  const maxAttempts = 100;

  // Đảm bảo mã là unique
  while (attempts < maxAttempts) {
    const existingUser = await User.findOne({ referralCode: code });
    if (!existingUser) {
      return code;
    }
    code = generateReferralCode();
    attempts++;
  }

  throw new Error("Không thể tạo mã giới thiệu unique sau nhiều lần thử");
}

async function migrateReferralCodes() {
  try {
    console.log("🔌 Đang kết nối database...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Đã kết nối database");

    // Tìm tất cả user chưa có referralCode
    const usersWithoutCode = await User.find({
      $or: [
        { referralCode: { $exists: false } },
        { referralCode: null },
        { referralCode: "" },
      ],
    });

    console.log(`📊 Tìm thấy ${usersWithoutCode.length} user chưa có mã giới thiệu`);

    if (usersWithoutCode.length === 0) {
      console.log("✅ Tất cả user đã có mã giới thiệu!");
      return;
    }

    let successCount = 0;
    let errorCount = 0;

    for (const user of usersWithoutCode) {
      try {
        const referralCode = await generateUniqueReferralCode();
        user.referralCode = referralCode;
        await user.save();
        successCount++;
        console.log(`✅ [${successCount}/${usersWithoutCode.length}] ${user.email} → ${referralCode}`);
      } catch (error) {
        errorCount++;
        console.error(`❌ Lỗi với user ${user.email}:`, error);
      }
    }

    console.log("\n📊 KẾT QUẢ:");
    console.log(`   ✅ Thành công: ${successCount}`);
    console.log(`   ❌ Thất bại: ${errorCount}`);
    console.log(`   📊 Tổng: ${usersWithoutCode.length}`);

  } catch (error) {
    console.error("❌ Lỗi migration:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Đã ngắt kết nối database");
  }
}

// Chạy migration
migrateReferralCodes();
