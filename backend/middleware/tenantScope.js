// backend/middleware/tenantScope.js
export function applyTenantScope(req, res, next) {
  const user = req.user;

  // Platform staff have no tenant — this middleware should never
  // be mounted on platform routes, but block defensively if it is
  if (user.isPlatformStaff) {
    return res.status(403).json({
      message: 'Platform staff cannot access hotel operations.',
    });
  }

  // Org-level roles (Owner, Admin, Regional Manager) scope to full org
  // Property-level roles scope to their specific property
  req.tenantFilter = user.propertyId
    ? { organizationId: user.organizationId, propertyId: user.propertyId }
    : { organizationId: user.organizationId };

  next();
}