require("dotenv").config();
import express, { Request, Response } from "express";
import userRouter from "./routes/user";
import authRouter from "./routes/auth";
import cors from "cors";
import mongoDB from "./db";
import globalCatch from "./middlewares/globalCatch";
import pingRouter from "./routes/ping";
import swaggerDocs from "./utils/swagger";
import queryRouter from "./routes/query";

const app = express();
const PORT: string | number = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send(`<pre> <i> A Privacy-Preserving Efficient Location-Sharing Scheme for Mobile Online Social Network Applications </i> 🛜 </pre>
	<pre> ~ Built with &#x1F499 by sanam </pre>`);
});

app.use("/api", authRouter);
app.use("/api", userRouter);
app.use("/api", pingRouter);
app.use("/api", queryRouter);

app.use(globalCatch);

mongoDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is listening at port no", PORT);
    swaggerDocs(app, PORT);
  });
});
