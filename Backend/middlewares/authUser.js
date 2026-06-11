import jwt from "jsonwebtoken";
import logger from "../config/logger.js";

const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.json({
        success: false,
        message: "Not authorised. Please log in again.",
      });
    }
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = token_decode.id;
    next();
  } catch (error) {
    logger.error({ err: error }, "[authUser]");
    res.json({
      success: false,
      message: "Not authorised. Please log in again.",
    });
  }
};

export default authUser;
