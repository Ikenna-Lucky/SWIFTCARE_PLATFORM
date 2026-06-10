import jwt from "jsonwebtoken";
import logger from "../config/logger.js";

const authDoctor = async (req, res, next) => {
  try {
    const { dtoken } = req.headers;
    if (!dtoken) {
      return res.json({
        success: false,
        message: "Not authorised. Please log in again.",
      });
    }

    const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET);
    // Attach to req directly — not req.body — so GET requests work reliably too
    req.docId = token_decode.id;
    next();
  } catch (error) {
    logger.error({ err: error }, "[authDoctor]");
    res.json({
      success: false,
      message: "Not authorised. Please log in again.",
    });
  }
};

export default authDoctor;
