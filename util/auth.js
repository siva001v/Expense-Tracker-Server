const jwt = require("jsonwebtoken");
const logger = require("./logger");

const JWT_SECRET = process.env.JWT_SECRET;

exports.auth = (req, res, next) => {
  const authorization = req.get("Authorization");
  if (!authorization) {
    return res.status(401).json({ message: "Not Authenticated" });
  }

  const token = authorization ? authorization.split("Bearer ")[1] : null;

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    logger.error("Error while authenticating", { error });
    return res.status(401).json({ message: "Invalid token" });
  }

  if (!decodedToken) {
    return res.status(401).json({ message: "Not Authenticated" });
  }

  req.userId = decodedToken.id;
  next();
};
