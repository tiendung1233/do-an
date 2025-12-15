import { Router } from 'express';
import {
  fetchAndSaveDataAffiliate,
  getPurchaseHistory,
  savePurchaseHistory,
  adminCreatePurchaseHistory,
  adminGetAllPurchaseHistory
} from '../controllers/purchaseHistory.controller';
import { protect } from '../middleware/auth';

const router = Router();

// User routes
router.post('/save', protect, savePurchaseHistory);
router.get('/', protect, getPurchaseHistory);

// Admin routes
router.post('/admin', protect, fetchAndSaveDataAffiliate);
router.post('/admin-create', protect, adminCreatePurchaseHistory);
router.get('/admin-all', protect, adminGetAllPurchaseHistory);

export default router;
