# AccessTrade API - Phân Tích Chi Tiết

## 📋 Tóm Tắt

Hệ thống sử dụng AccessTrade API để lấy dữ liệu giao dịch của người dùng. **KEY CHÍNH để phân biệt tài khoản nào ứng với đơn hàng nào là: `utm_source`**

---

## 🔑 KEY CHÍNH PHÂN BIỆT TÀI KHOẢN

### **UTM_SOURCE - Định danh chính của User**

**Vị trí:** Trong mỗi transaction từ AccessTrade API, trường `utm_source` chứa **ID của user** được mã hóa.

**Format:**

```
utm_source: "j:\"[USER_ID]\""
```

**Ví dụ:**

```
utm_source: "j:\"507f1f77bcf86cd799439011\""
```

**Cách Extract ID:**

```typescript
// Hàm trong ultils/func.ts
export function extractId(input: string): string {
  const match = input.match(/j:\\?"([^"]+)\\?"/);
  return match ? match[1] : "";
}
```

---

## 📡 API Call Flow

### **1. Frontend - Tạo Deep Link với UTM_SOURCE**

**File:** [`SmartCash-shopping/components/acesstrade/accesstradeWidget.tsx`](SmartCash-shopping/components/acesstrade/accesstradeWidget.tsx)

```typescript
// Lấy ID user từ cookie
const userId = Cookies.get("id"); // VD: "507f1f77bcf86cd799439011"
setUtmSource(userId);

// Khi tạo deep link cho Shopee
let deepLink = `https://go.isclix.com/deep_link/6019537891464095047/4751584435713464237?sub3=tooldirectlink&sub4=oneatweb`;
if (utmSource) {
  deepLink += "&utm_source=" + utmSource; // Thêm user ID vào link
}
deepLink += "&url=" + encodeURIComponent(text);

// User click vào link này → được tracking với utm_source = user_id
```

**Tương tự cho MediaMart:** [`SmartCash-shopping/components/acesstrade/mediaMartWidget.tsx`](SmartCash-shopping/components/acesstrade/mediaMartWidget.tsx)

```typescript
let deepLink = `https://go.isclix.com/deep_link/6019537891464095047/6009072433920808367?...`;
if (utmSource) deepLink += `&utm_source=${utmSource}`;
```

---

### **2. Backend - Fetch API từ AccessTrade**

**File:** [`cashback-server/src/controllers/purchaseHistory.controller.ts`](cashback-server/src/controllers/purchaseHistory.controller.ts) - Lines 82-110

```typescript
const fetchDataFromAPI = async (params: {
  utm_source?: string;
  merchant?: string;
  limit?: number;
  status?: number;
}): Promise<APIResponse> => {
  const { utm_source, merchant, limit, status } = params;

  let apiUrl = "https://api.accesstrade.vn/v1/transactions?";
  apiUrl += `since=2021-01-01T00:00:00Z&until=2026-01-03T00`;

  // Thêm utm_source vào query (có thể filter cho 1 user cụ thể)
  if (utm_source) apiUrl += `&utm_source=${utm_source}`;
  if (merchant) apiUrl += `&merchant=${merchant}`;
  if (limit) apiUrl += `&limit=${limit}`;
  if (status !== undefined) apiUrl += `&status=${status}`;

  // API TOKEN (lưu ý: đây là sensitive data)
  const response = await fetch(apiUrl, {
    headers: {
      Authorization: "Token b2YarfQvCZooDdHSNMIJoQYwawTP_cqY",
    },
  });

  return response.json();
};
```

**Response Structure:**

```typescript
interface APIData {
  merchant: string; // Tên cửa hàng (VD: "Shopee")
  status: number; // 1 = Approved, 0 = Pending, -1 = Rejected
  transaction_time: string; // Thời gian giao dịch
  transaction_value: number; // Giá trị đơn hàng
  product_quantity: number; // Số lượng sản phẩm
  transaction_id: string; // ID giao dịch duy nhất
  click_url: string; // URL sản phẩm
  utm_source: string; // KEY CHÍNH: "j:\"[USER_ID]\""
  product_price: number; // Giá sản phẩm
  commission: number; // Hoa hồng/Cashback cơ bản
  reason_rejected?: string; // Lý do reject (nếu có)
}

interface APIResponse {
  total: number;
  data: APIData[];
}
```

---

### **3. Data Processing & Saving to Database**

**Admin Endpoint:** `POST /api/purchase-history/admin`

```typescript
export const fetchAndSaveDataAffiliate = async (
  req: Request,
  res: Response
) => {
  // Kiểm tra quyền admin
  if (!req.user || (req.user as any).role <= 0) {
    return res.status(403).json({ error: "Forbidden: Insufficient role" });
  }

  // Request body có thể chứa utm_source để filter 1 user
  const { utm_source, merchant, limit, status } = req.body;

  // Gọi API AccessTrade
  const apiResponse = await fetchDataFromAPI({
    utm_source: utm_source && `j:"${utm_source}"`, // Format lại thành "j:\"[ID]\""
    merchant,
    limit,
    status,
  });

  // Extract user ID từ mỗi transaction
  const userData = await Promise.all(
    apiResponse.data.map(async (item) => {
      const userId = extractId(item.utm_source); // Lấy ID từ "j:\"[ID]\""
      const user = userId
        ? await User.findById(userId).select("name email")
        : null;

      return {
        ...item,
        userName: user?.name || "Không xác định",
        email: user?.email || "Không xác định",
      };
    })
  );

  // Lưu vào database
  const transformedData = apiResponse.data.map((item) => ({
    merchant: item.merchant,
    status: item.status,
    transaction_time: item.transaction_time,
    transaction_value: item.transaction_value,
    product_quantity: item.product_quantity,
    transaction_id: item.transaction_id, // Unique identifier cho đơn hàng
    click_url: item.click_url,
    utm_source: extractId(item.utm_source), // User ID
    product_price: item.product_price,
    commission: item.commission,
    reason_rejected: item.reason_rejected,
  }));

  await saveToDatabase(transformedData);

  return res.status(200).json({
    total: apiResponse.total,
    userData: userData, // Trả về với thông tin user
  });
};
```

## ∑

### **4. Save to Database**

```typescript
const saveToDatabase = async (data: APIData[]) => {
  for (const item of data) {
    if (item.utm_source) {
      // Phải có user ID
      // Kiểm tra không trùng
      const existingRecord = await PurchaseHistory.findOne({
        transaction_id: item.transaction_id, // transaction_id là duy nhất
      });

      if (!existingRecord) {
        // Lấy user từ user ID (trong utm_source)
        const user = await User.findById(item.utm_source);

        // Tính toán cashback có membership bonus
        let totalCashback = item.commission;
        let membershipBonusPercent = 0;
        let membershipBonusAmount = 0;

        if (user && item.status === 1) {
          // Chỉ tính bonus nếu approved
          const membershipTier = (user.membershipTier ||
            "none") as MembershipTier;
          membershipBonusPercent = MEMBERSHIP_CASHBACK_BONUS[membershipTier];
          membershipBonusAmount =
            (item.transaction_value * membershipBonusPercent) / 100;
          totalCashback += membershipBonusAmount;
        }

        // Lưu purchase history
        const newRecord = new PurchaseHistory({
          userId: item.utm_source, // ⭐ User ID từ utm_source
          productName: item.merchant,
          price: item.transaction_value,
          productLink: item.click_url,
          cashbackPercentage: 0,
          cashback: totalCashback,
          quantity: item.product_quantity,
          purchaseDate: new Date(item.transaction_time),
          transaction_id: item.transaction_id, // ⭐ Unique transaction ID
          status:
            item.status === 1
              ? "Đã duyệt"
              : item.status === 0
              ? "Đang xử lý"
              : "Hủy",
          membershipBonusPercent: membershipBonusPercent,
          membershipBonusAmount: membershipBonusAmount,
        });

        await newRecord.save();

        // Cộng tiền cho user nếu approved
        if (user && item.status === 1) {
          user.money = (user.money || 0) + totalCashback;
          await user.save();
        }
      }
    }
  }
};
```

---

## 📊 Database Schema

**File:** [`cashback-server/src/models/purchaseHistory.model.ts`](cashback-server/src/models/purchaseHistory.model.ts)

```typescript
interface IPurchaseHistory extends Document {
  userId: string; // ⭐ User ID (từ utm_source)
  productName: string; // Merchant name
  price: number; // transaction_value
  productLink: string; // click_url
  cashbackPercentage: number;
  cashback: number; // commission + membership bonus
  quantity: number; // product_quantity
  purchaseDate: Date; // transaction_time
  status: "Đang xử lý" | "Đã duyệt" | "Hủy"; // Từ status
  transaction_id: string; // ⭐ Unique transaction ID
  membershipBonusPercent: number;
  membershipBonusAmount: number;
  voucherUsed: boolean;
  voucherCode?: string;
  voucherBonusPercent: number;
  bonusCashback: number;
}
```

---

## 🔗 Kết Nối Toàn Bộ Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User click link Shopee với utm_source=USER_ID            │
│    Nguồn: accesstradeWidget.tsx                              │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. User mua hàng trên Shopee (AccessTrade tracking)         │
│    AccessTrade API tạo transaction với:                      │
│    - utm_source: "j:\"[USER_ID]\""                          │
│    - transaction_id: unique ID                              │
│    - commission: hoa hồng từ Shopee                          │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Admin gọi API: POST /api/purchase-history/admin          │
│    Endpoint: fetchAndSaveDataAffiliate                       │
│    - Gọi AccessTrade API lấy transactions                   │
│    - Có thể filter theo utm_source (user ID)                │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Backend xử lý:                                            │
│    - Extract userId từ utm_source dùng extractId()          │
│    - Tìm user từ userId                                     │
│    - Tính membership bonus cashback                          │
│    - Lưu vào PurchaseHistory DB với:                        │
│      * userId: extracted from utm_source                    │
│      * transaction_id: unique identifier                    │
│      * status: từ AccessTrade (1=approved, 0=pending, -1=rejected)
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Cộng tiền cho user (nếu status = 1/approved)             │
│    - Cộng cashback cơ bản (commission)                       │
│    - Cộng membership bonus                                   │
│    - Update user.money                                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 AccessTrade API Credentials

**Token:** `b2YarfQvCZooDdHSNMIJoQYwawTP_cqY`
**Endpoint:** `https://api.accesstrade.vn/v1/transactions`

⚠️ **CẢNH BÁO:** Token này là sensitive data - nên lưu vào environment variables, không hardcode trong source code!

---

## 📝 Các Parameter Query AccessTrade API

| Parameter    | Kiểu    | Mô Tả                                                       |
| ------------ | ------- | ----------------------------------------------------------- |
| `since`      | ISO8601 | Thời gian bắt đầu (VD: 2021-01-01T00:00:00Z)                |
| `until`      | ISO8601 | Thời gian kết thúc                                          |
| `utm_source` | String  | Filter theo user ID (format: `j:"[USER_ID]"`)               |
| `merchant`   | String  | Filter theo cửa hàng (VD: "Shopee")                         |
| `status`     | Number  | Filter theo trạng thái (1=approved, 0=pending, -1=rejected) |
| `limit`      | Number  | Giới hạn số lượng results                                   |

**Ví dụ Query:**

```
GET https://api.accesstrade.vn/v1/transactions?
  since=2021-01-01T00:00:00Z&
  until=2026-01-03T00&
  utm_source=j:"507f1f77bcf86cd799439011"&
  merchant=Shopee&
  limit=100&
  status=1
```

---

## 🎯 Tóm Tắt Keys Chính

| Key                | Vị Trí                | Mục Đích               | Format                                       |
| ------------------ | --------------------- | ---------------------- | -------------------------------------------- |
| **utm_source**     | Trong mỗi transaction | **Phân biệt user**     | `j:"[USER_ID]"` → Extract → MongoDB ObjectId |
| **transaction_id** | Trong mỗi transaction | **Phân biệt đơn hàng** | Unique string identifier                     |
| **userId**         | PurchaseHistory DB    | Store user ID          | MongoDB ObjectId                             |
| **status**         | Trong transaction     | Trạng thái đơn hàng    | 1 (Approved), 0 (Pending), -1 (Rejected)     |

---

## 💡 Cách Phân Biệt Tài Khoản & Đơn Hàng

### **Phân Biệt Tài Khoản:**

1. **Frontend:** Lấy `userId` từ cookie → Thêm vào deep link với tham số `utm_source=userId`
2. **Backend:** Khi lấy transaction từ AccessTrade → Lấy trường `utm_source` → Extract ID → Lấy user từ MongoDB
3. **Database:** Lưu `userId` trong `PurchaseHistory.userId`

### **Phân Biệt Đơn Hàng:**

1. **Unique Key:** `transaction_id` từ AccessTrade API là unique cho mỗi giao dịch
2. **Check Duplicate:** Query `PurchaseHistory.findOne({ transaction_id })` trước khi save
3. **Combine Keys:** Một đơn hàng được định danh duy nhất bởi `(userId + transaction_id)`

---

## 📚 Related Files

### **Frontend (Next.js)**

- [`SmartCash-shopping/components/acesstrade/accesstradeWidget.tsx`](SmartCash-shopping/components/acesstrade/accesstradeWidget.tsx) - Shopee widget
- [`SmartCash-shopping/components/acesstrade/mediaMartWidget.tsx`](SmartCash-shopping/components/acesstrade/mediaMartWidget.tsx) - MediaMart widget

### **Backend (Node.js/Express)**

- [`cashback-server/src/controllers/purchaseHistory.controller.ts`](cashback-server/src/controllers/purchaseHistory.controller.ts) - Main logic
- [`cashback-server/src/models/purchaseHistory.model.ts`](cashback-server/src/models/purchaseHistory.model.ts) - DB schema
- [`cashback-server/src/models/user.model.ts`](cashback-server/src/models/user.model.ts) - User schema
- [`cashback-server/src/routes/purchaseHistory.routes.ts`](cashback-server/src/routes/purchaseHistory.routes.ts) - API routes
- [`cashback-server/src/ultils/func.ts`](cashback-server/src/ultils/func.ts) - extractId() helper
