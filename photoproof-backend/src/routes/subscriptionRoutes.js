const express = require('express');
const router = express.Router();
const {
  getSubscriptionStatus,
  upgradePlan
} = require('../controllers/subscriptionController');
const { protect } = require('../middleware/authMiddleware');

router.get('/status', protect, getSubscriptionStatus);
router.post('/upgrade', protect, upgradePlan);

module.exports = router;
