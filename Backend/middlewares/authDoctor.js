import jwt from "jsonwebtoken";

// Doctor authentication middleware
const authDoctor = async (req, res, next) => {
  // the next here is a callback function
  try {
    const { dtoken } = req.headers;
    if (!dtoken) {
      return res.json({
        success: false,
        message: "Not Authorized,Login Again",
      });
    }

    const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET); // To decode the generated token
    req.body.docId = token_decode.id;
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authDoctor;
