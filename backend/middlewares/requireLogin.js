require("dotenv").config(); 
const User = require("../models/model"); 
const jwt = require("jsonwebtoken"); 
const jwtSecret = process.env.SECRET_KEY;

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).send({ errors: "You must have logged in" });
  } else { 
    const token = authorization.replace("Bearer ", "");
    // console.log(token);
    // console.log(jwtSecret);
    try {
      const info = jwt.verify(token, jwtSecret);
      // console.log(info);
      const currUser = await User.findById({ _id: info._id });
      // console.log(currUser);
      req.user = currUser;
      next();
    } catch (error) {
      console.log(error);
      return res.status(401).send({ errors: "You must have logged in" });
    }
  }
};
