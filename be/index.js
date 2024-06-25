import express from "express";
import dotenv from "dotenv";
import db from "./config/db.js";

dotenv.config();

const app = express();
const baseURL = "/api/v1";

db();
app.use(express.json());


app.use("/", (req, res) => res.send({ app: "align_mern_app" }));

app.listen(process.env.PORT, () =>
  console.log(`Server is listening on port ${process.env.PORT}`)
);
