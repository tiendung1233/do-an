import { Request, Response } from "express";
import User from "../models/user.model";
import jwt from "jsonwebtoken";
import validator from "validator";
import { sendResetPasswordEmail } from "../ultils/sendEmail";
import * as XLSX from "xlsx";

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById((req.user as any)._id).select(
      "-password -verificationRequestsCount -lastVerificationRequest"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error getting user profile:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

export const getAllUserProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user || (req.user as any).role <= 0) {
      return res.status(403).json({ error: "Forbidden: Insufficient role" });
    }

    const { email, sortBy, order = "asc" } = req.query;

    const filter: Record<string, any> = {};
    if (email) {
      filter.email = { $regex: email, $options: "i" };
    }

    const sortField =
      sortBy === "date" ? "createdAt" : sortBy === "money" ? "money" : null;
    const sortOrder = order === "desc" ? -1 : 1;

    const users = await User.find(filter)
      .select(
        "-password -verificationRequestsCount -lastVerificationRequest -_v -spinToken -trees"
      )
      .sort(sortField ? { [sortField]: sortOrder } : {});

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error("Error getting user profiles:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById((req.user as any)._id);

    if (!validator.isEmail(req.body.email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.accountBank = req.body.accountBank || user.accountBank;
    user.bankName = req.body.bankName || user.bankName;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
    user.address = req.body.address || user.address;
    user.city = req.body.city || user.city;
    user.inviteCode = req.body.inviteCode || user.inviteCode;
    user.image = req.body.image || user.image;

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      accountBank: updatedUser.accountBank,
      bankName: updatedUser.bankName,
      phoneNumber: updatedUser.phoneNumber,
      address: updatedUser.address,
      city: updatedUser.city,
      message: "User profile updated successfully",
      inviteCode: updatedUser.inviteCode,
      image: updatedUser.image,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById((req.user as any)._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (currentPassword === newPassword) {
      return res.status(401).json({ message: "Incorrect new password" });
    }

    const isMatch = await user.comparePassword!(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect current password" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "No user found with this email" });
    }

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "10m",
    });

    await sendResetPasswordEmail(user.email, resetToken);

    res.status(200).json({ message: "Reset password email sent successfully" });
  } catch (error) {
    console.error("Error sending reset password email:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res
        .status(404)
        .json({ message: "Invalid token or user not found" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    if (!req.user || (req.user as any).role <= 0) {
      return res.status(403).json({ error: "Forbidden: Insufficient role" });
    }

    const { userId } = req.params;
    const updates = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const allowedUpdates = [
      "name",
      "phoneNumber",
      "address",
      "bankName",
      "accountBank",
      "money",
      "total",
      "city",
      "image",
      "freeSpins",
      "email",
      "secretBoxesCollected",
    ];
    Object.keys(updates).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        (user as any)[key] = updates[key];
      }
    });

    await user.save();
    res.status(200).json({ message: "User updated successfully.", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    if (!req.user || (req.user as any).role <= 0) {
      return res.status(403).json({ error: "Forbidden: Insufficient role" });
    }

    const { userId } = req.params;

    if ((req.user as any)._id === userId) {
      return res.status(404).json({ message: "Error deleting user" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if(user.role! > 1){
      return res.status(404).json({ message: "Error deleting user" });
    }

    await user.deleteOne();
    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    if (!req.user || (req.user as any).role <= 0) {
      return res.status(403).json({ error: "Forbidden: Insufficient role" });
    }

    const {
      name,
      email,
      password,
      role,
      phoneNumber,
      address,
      bankName,
      accountBank,
    } = req.body;

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already in use." });
    }

    const newUser = new User({
      name,
      email,
      password,
      role,
      phoneNumber,
      address,
      bankName,
      accountBank,
      isVerify: true,
    });

    await newUser.save();
    res
      .status(201)
      .json({ message: "User created successfully.", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Import users from CSV/XLSX file
export const importUsers = async (req: Request, res: Response) => {
  try {
    if (!req.user || (req.user as any).role <= 0) {
      return res.status(403).json({ error: "Forbidden: Insufficient role" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data: any[] = XLSX.utils.sheet_to_json(worksheet);

    if (!data || data.length === 0) {
      return res.status(400).json({ message: "File is empty or invalid format." });
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [] as { row: number; email: string; reason: string }[],
    };

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNumber = i + 2; // +2 because row 1 is header, and array is 0-indexed

      try {
        // Validate required fields
        const email = row.email || row.Email || row.EMAIL;
        const name = row.name || row.Name || row.NAME || row["Họ tên"] || row["Ho ten"];
        const password = row.password || row.Password || row.PASSWORD || "123456";

        if (!email) {
          results.failed++;
          results.errors.push({
            row: rowNumber,
            email: "N/A",
            reason: "Email is required",
          });
          continue;
        }

        if (!validator.isEmail(email)) {
          results.failed++;
          results.errors.push({
            row: rowNumber,
            email,
            reason: "Invalid email format",
          });
          continue;
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          results.failed++;
          results.errors.push({
            row: rowNumber,
            email,
            reason: "Email already exists",
          });
          continue;
        }

        // Create new user
        const newUser = new User({
          name: name || email.split("@")[0],
          email,
          password,
          phoneNumber: row.phoneNumber || row.PhoneNumber || row["Số điện thoại"] || row["SDT"] || "",
          address: row.address || row.Address || row["Địa chỉ"] || "",
          city: row.city || row.City || row["Thành phố"] || "",
          bankName: row.bankName || row.BankName || row["Ngân hàng"] || "",
          accountBank: row.accountBank || row.AccountBank || row["Số tài khoản"] || row["STK"] || "",
          money: parseFloat(row.money || row.Money || row["Số dư"] || "0") || 0,
          total: parseFloat(row.total || row.Total || row["Tổng tiền"] || "0") || 0,
          isVerified: true,
          role: 0,
        });

        await newUser.save();
        results.success++;
      } catch (error: any) {
        results.failed++;
        results.errors.push({
          row: rowNumber,
          email: row.email || row.Email || "N/A",
          reason: error.message || "Unknown error",
        });
      }
    }

    res.status(200).json({
      message: `Import completed. Success: ${results.success}, Failed: ${results.failed}`,
      results,
    });
  } catch (error) {
    console.error("Error importing users:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Download sample template for import
export const downloadImportTemplate = async (req: Request, res: Response) => {
  try {
    if (!req.user || (req.user as any).role <= 0) {
      return res.status(403).json({ error: "Forbidden: Insufficient role" });
    }

    const templateData = [
      {
        email: "example@email.com",
        name: "Nguyễn Văn A",
        password: "123456",
        phoneNumber: "0901234567",
        address: "123 Đường ABC",
        city: "Hồ Chí Minh",
        bankName: "Vietcombank",
        accountBank: "1234567890",
        money: 0,
        total: 0,
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    // Set column widths
    worksheet["!cols"] = [
      { wch: 25 }, // email
      { wch: 20 }, // name
      { wch: 15 }, // password
      { wch: 15 }, // phoneNumber
      { wch: 30 }, // address
      { wch: 15 }, // city
      { wch: 20 }, // bankName
      { wch: 20 }, // accountBank
      { wch: 10 }, // money
      { wch: 10 }, // total
    ];

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="import_users_template.xlsx"'
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buffer);
  } catch (error) {
    console.error("Error generating template:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
