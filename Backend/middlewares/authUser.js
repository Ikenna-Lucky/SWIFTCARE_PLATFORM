import jwt from "jsonwebtoken";

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
    // Attach to req directly — not req.body — so GET requests work reliably too
    req.userId = token_decode.id;
    next();
  } catch (error) {
    console.error("[authUser]", error);
    res.json({
      success: false,
      message: "Not authorised. Please log in again.",
    });
  }
};

export default authUser;
