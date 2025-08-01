import jwt from "jsonwebtoken";

export const createToken = async (data) => {
  const token = await jwt.sign(data, process.env.SECRET, { expiresIn: "10m" });

  return token;
};