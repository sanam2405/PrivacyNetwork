require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const mongodb = require("./db");

// require("./models/model");
// require("./models/post"); 

app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("<h1>Hello World</h1>");
})

app.listen(PORT,()=>{
    console.log("Server is listening at port no ", PORT);
})

// app.use("/api", require("./routes/auth"));
// app.use("/api", require("./routes/createpost"));
// app.use("/api", require("./routes/user"));

// app.get("*", (req, res) => {
//   res.sendFile(
//     path.join(__dirname, "./frontend/build/index.html"),
//     function (err) {
//       res.status(500).send(err)
//     }
//   )
// })


mongodb().then(() => {
  app.listen(PORT, () => {
    console.log("Server is listening at port no", PORT);
  });
});