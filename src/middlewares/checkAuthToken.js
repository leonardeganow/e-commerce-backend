import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

// Middleware to check the authorization token
const checkAuthToken = (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  // Verify the token using your secret key
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    req.user = decoded;

    next();
  });
};

export default checkAuthToken;
