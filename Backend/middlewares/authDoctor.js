import jwt from "jsonwebtoken";

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
    console.error("[authDoctor]", error);
    res.json({
      success: false,
      message: "Not authorised. Please log in again.",
    });
  }
};

export default authDoctor;
