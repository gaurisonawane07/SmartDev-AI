import jwt from "jsonwebtoken";

const generateToken = (id) => {
  const expiresIn = process.env.JWT_EXPIRES_IN || "1d";

  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn }
  );
};

export default generateToken;