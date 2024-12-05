import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

// Middleware to check the authorization token
const checkAuthToken = (req, res, next) => {
  // Get the token from the Authorization header (e.g., "Bearer <token>")
  const token = req.headers["authorization"]?.split(" ")[1]; // Split to remove "Bearer"

  // If no token is found, respond with 401 Unauthorized
  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  // Verify the token using your secret key
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Attach the decoded user data to the request object for use in subsequent middleware/routes
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  });
};

export default checkAuthToken;
