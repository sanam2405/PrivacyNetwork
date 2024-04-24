require("dotenv").config();
import jwt from "jsonwebtoken";

interface TokenPayload {
  _id: string;
}

export default function tokenIsValid(token: string) {
  const JWT_SECRET = process.env.SECRET_KEY;
  try {
    if (!JWT_SECRET) {
      console.error("SECRET_KEY is undefined. Check the .env");
      return false;
    }

    const info = jwt.verify(token, JWT_SECRET) as TokenPayload;
    console.log("JWT info received by ws server", info);
    console.log("JWT userID received by ws server ", info._id);
  } catch {
    return false;
  }
  return true;
}
