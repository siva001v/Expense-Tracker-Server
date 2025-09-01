const jwt = require("jsonwebtoken");

const BCRYPT_SECRET = process.env.BCRYPT_SECRET;

exports.auth = (req, res, next) => {
  const authorization = req.get("Authorization");
  if (!authorization) {
    return res.status(401).json({ message: "Not Authenticated" });
  }

  const token = authorization ? authorization.split("Bearer ")[1] : null;

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, BCRYPT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }

  if (!decodedToken) {
    return res.status(401).json({ message: "Not Authenticated" });
  }

  req.userId = decodedToken.id;
  next();
};
