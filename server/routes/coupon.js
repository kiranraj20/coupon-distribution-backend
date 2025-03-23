import Coupon from '../models/Coupon.js';
import auth from '../middleware/auth.js';
import express from 'express';
const router = express.Router();
import Claim from '../models/Claim.js';
import abusePrevention from '../middleware/abusePrevention.js';

router.get('/claim', abusePrevention, async (req, res) => {
  try {
    const ip = req.ip;
    const cookieId = req.cookies['session'] || Math.random().toString(36).substring(2);

    const recentClaim = await Claim.findOne({
      $or: [{ ip }, { cookieId }],
      timestamp: { $gte: Date.now() -  60 * 1000 },
    });
    
    if (recentClaim) return res.status(429).json({ message: 'Please wait before claiming again' });

    const coupon = await Coupon.findOneAndUpdate(
      { isClaimed: false, isActive: true },
      { isClaimed: true },
      { sort: { _id: 1 } }
    );

    if (!coupon) return res.status(404).json({ message: 'No coupons available' });

    await new Claim({ ip, cookieId, couponId: coupon._id }).save();
    res.cookie('session', cookieId, { maxAge:  60 * 1000 });
    res.json({ coupon: coupon.code });
  } catch (error) {
    res.json({ message: 'Server error', error });
  }
});

router.get('/claims', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Claim.countDocuments();
    const claims = await Claim.find()
      .populate('couponId', 'code')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      claims,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/coupons', auth, async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ message: 'Coupon code is required' });

    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) return res.status(400).json({ message: 'Coupon already exists' });

    const coupon = new Coupon({ code, isClaimed: false, isActive: true });
    await coupon.save();
    res.status(201).json(coupon);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/coupons/:id', auth, async (req, res) => {
  try {
    const { code, isActive } = req.body;
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });

    if (code) coupon.code = code;
    if (typeof isActive === 'boolean') coupon.isActive = isActive;

    await coupon.save();
    res.json(coupon);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/coupons', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Coupon.countDocuments();
    const coupons = await Coupon.find()
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit);

    res.json({
      coupons,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.delete('/coupons/:id', auth, async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    const claim = await Claim.findOne({ couponId: req.params.id });
    if (claim) {
      return res.status(400).json({ message: 'Cannot delete a claimed coupon' });
    }

    await Coupon.deleteOne({ _id: req.params.id });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
