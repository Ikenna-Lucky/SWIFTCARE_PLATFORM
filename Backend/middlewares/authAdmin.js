import jwt from "jsonwebtoken";

const authAdmin = async (req, res, next) => {
  try {
    const { atoken } = req.headers;
    if (!atoken) {
      return res.json({
        success: false,
        message: "Not authorised. Please log in again.",
      });
    }

    const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);
    if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      return res.json({
        success: false,
        message: "Not authorised. Please log in again.",
      });
    }

    next();
  } catch (error) {
    console.error("[authAdmin]", error);
    res.json({
      success: false,
      message: "Not authorised. Please log in again.",
    });
  }
};

export default authAdmin;
