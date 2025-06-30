//check_admin

exports.isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      status: 403,
      message: "Access denied. Admins only.",
    });
  }
  next();
};
