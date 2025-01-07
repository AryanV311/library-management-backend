import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not Authorized. Please login." });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken || !decodedToken.id) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Invalid Token. Please login again.",
        });
    }

    req.user = { id: decodedToken.id };
    next();
  } catch (error) {
    console.error("Authentication Error:", error.message);
    res
      .status(400)
      .json({
        success: false,
        message: "Authentication failed. Please try again.",
      });
  }
};

export default authUser;
