const User = require('../models/User');

const PLAN_TIERS = {
  FREE: { storageLimitBytes: 2 * 1024 * 1024 * 1024, price: '₹0' },
  STARTER: { storageLimitBytes: 20 * 1024 * 1024 * 1024, price: '₹199/month' },
  PRO: { storageLimitBytes: 100 * 1024 * 1024 * 1024, price: '₹499/month' },
  STUDIO: { storageLimitBytes: 250 * 1024 * 1024 * 1024, price: '₹999/month' }
};

/**
 * @desc    Get subscription status & storage quota
 * @route   GET /api/subscription/status
 * @access  Private
 */
const getSubscriptionStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const usedGb = (user.storageUsedBytes / (1024 * 1024 * 1024)).toFixed(1);
    const limitGb = (user.storageLimitBytes / (1024 * 1024 * 1024)).toFixed(1);

    res.json({
      success: true,
      data: {
        plan: user.plan,
        storageUsedBytes: user.storageUsedBytes,
        storageLimitBytes: user.storageLimitBytes,
        usedGb,
        limitGb,
        usagePercentage: Math.min(100, Math.round((user.storageUsedBytes / user.storageLimitBytes) * 100)),
        savingsPercent: 38,
        planPrice: PLAN_TIERS[user.plan]?.price || '₹499/month',
        upiNumber: user.upiNumber || '80109471110',
        upiId: user.upiId || '80109471110@upi'
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upgrade subscription tier
 * @route   POST /api/subscription/upgrade
 * @access  Private
 */
const upgradePlan = async (req, res, next) => {
  try {
    const { targetPlan } = req.body;

    if (!PLAN_TIERS[targetPlan]) {
      return res.status(400).json({ success: false, message: 'Invalid plan selected' });
    }

    const user = await User.findById(req.user._id);
    user.plan = targetPlan;
    user.storageLimitBytes = PLAN_TIERS[targetPlan].storageLimitBytes;
    await user.save();

    res.json({
      success: true,
      message: `Plan upgraded to ${targetPlan} successfully!`,
      data: {
        plan: user.plan,
        storageLimitBytes: user.storageLimitBytes
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSubscriptionStatus,
  upgradePlan
};
