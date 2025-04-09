import express from 'express';
import { 
  getAdminStats,
  getAllAppointments,
  updateAppointmentStatus,
  getAllUsers,
  getUserById,
  getUserWishlist,
  removeUserWishlist,
  deleteUser
} from '../controller/adminController.js';
import authMiddleware from '../middleware/authmiddleware.js';

const router = express.Router();

// Existing admin routes
router.get('/stats', getAdminStats);
router.get('/appointments', getAllAppointments);
router.put('/appointments/status', updateAppointmentStatus);

// User management routes
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.get('/users/:id/wishlist', getUserWishlist);
router.delete('/users/:id/wishlist/:propertyId', removeUserWishlist);
router.delete('/users/:id', deleteUser);

export default router;