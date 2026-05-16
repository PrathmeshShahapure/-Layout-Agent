import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRoute from "./routes/chat.js";

dotenv.config();

const app =express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.use("/api/chat", chatRoute);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});