module.exports = function(req, res, next) {
  /* alternatively if you were doing it with strings yeah you could just say 
    if(req.user.role != "admin") */
  if (!req.user.isAdmin) return res.status(403).send("access denied");
  next();
};
