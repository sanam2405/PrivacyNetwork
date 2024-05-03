require("dotenv").config();
import axios from "axios";
import jwt from "jsonwebtoken";
import HttpStatusCode from "../types/HttpStatusCodes";

interface TokenPayload {
  _id: string;
}

export default async function tokenIsValid(token: string) {
  const JWT_SECRET = process.env.SECRET_KEY;
  const TS_BACKEND_URI = process.env.TS_BACKEND_URI;
  try {
    if (!JWT_SECRET) {
      console.error("SECRET_KEY is undefined. Check the .env");
      return false;
    }

    if (!TS_BACKEND_URI) {
      console.error("TS_BACKEND_URI is undefined. Check the .env");
      return false;
    }

    const info = jwt.verify(token, JWT_SECRET) as TokenPayload;

    console.log("JWT info received by ws server", info);
    console.log("JWT userID received by ws server ", info._id);
    const response = await axios.get(`${TS_BACKEND_URI}/api/user/${info._id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status !== HttpStatusCode.OK) {
      return false;
    }
  } catch {
    return false;
  }
  return true;
}
