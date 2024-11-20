import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import messageRoutes from "./routes/message.routes";
import connectToMongoDB from "./db/connectToMongoDB";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5001;

app.use(cookieParser()); // for parsing cookies
app.use(express.json()); // for parsing application/json

app.use("/v1/auth", authRoutes);
app.use("/v1/messages", messageRoutes);

app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`server running on port ${PORT}`);
});
