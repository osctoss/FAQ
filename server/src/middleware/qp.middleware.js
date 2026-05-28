import { QP_THRESHOLDS } from '../../../shared/constants.js';

export const requireQP = (minQP) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (req.user.qp < minQP) {
      return res.status(403).json({
        message: `Minimum ${minQP} QP required to perform this action`,
        currentQP: req.user.qp
      });
    }
    next();
  };
};

export const requireNotRestricted = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  if (req.user.restrictedAt) {
    return res.status(403).json({ message: 'Your account has been restricted from performing activities' });
  }
  next();
};