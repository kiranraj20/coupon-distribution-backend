import Claim from '../models/Claim.js';

const abusePrevention = async (req, res, next) => {
  const ip = req.ip;
  const cookieId = req.cookies['session'] || Math.random().toString(36).substring(2);
  const cooldownPeriod =  60 * 1000;

  try {
    // Check for recent claims by IP or cookie
    const recentClaim = await Claim.findOne({
      $or: [{ ip }, { cookieId }],
      timestamp: { $gte: Date.now() - cooldownPeriod },
    });

    if (recentClaim) {
      return res.status(429).json({
        message: 'You can only claim one coupon every 1 Min. Please try again later.',
      });
    }

    req.cookieId = cookieId;
    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error during abuse check' });
  }
};

export default abusePrevention;