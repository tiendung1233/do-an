import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.route";
import cartRoutes from "./routes/cart.routes";
import withdrawRoutes from "./routes/withdraw.routes";
import gardenRoutes from "./routes/tree.routes";
import productRoutes from "./routes/product.routes";
import shopRoutes from "./routes/shop.routes";
import purchaseHistoryRoutes from "./routes/purchaseHistory.routes";
import chatRoutes from "./routes/chat.routes";
import leaderboardRoutes from "./routes/leaderboard.routes";
import referralRoutes from "./routes/referral.routes";
import checkInRoutes from "./routes/checkIn.routes";
import voucherRoutes from "./routes/voucher.routes";
import passport from "passport";
import session from "express-session";
import cors from "cors";
import MongoStore from "connect-mongo";
import "./config/passport";

dotenv.config();
connectDB();

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      maxAge: 60000,
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI || "",
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/withdraw", withdrawRoutes);
app.use("/api/garden", gardenRoutes);
app.use("/api/product", productRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/purchase-history", purchaseHistoryRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/referral", referralRoutes);
app.use("/api/checkin", checkInRoutes);
app.use("/api/voucher", voucherRoutes);

export default app;
