import jwt from "jsonwebtoken";
import NextRequest from "next/server";

export const getDataFromToken = (request) => {
  try {
    const token = request.cookies.get("token")?.value || "";
    const decodeToken = jwt.verify(token, process.env.TOKEN_SECRET);
    return decodeToken.id;
  } catch (error) {
    throw new Error(error.message);
  }
};
