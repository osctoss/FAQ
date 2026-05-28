import { authenticate } from './auth.middleware.js';
import { authorizeRoles } from './role.middleware.js';
import { requireQP, requireNotRestricted } from './qp.middleware.js';

export const secureAccess = ({ roles = [], minQP = null, checkRestriction = true } = {}) => {
  const middlewares = [authenticate];
  if (roles.length) middlewares.push(authorizeRoles(...roles));
  if (minQP !== null) middlewares.push(requireQP(minQP));
  if (checkRestriction) middlewares.push(requireNotRestricted);
  return middlewares;
};