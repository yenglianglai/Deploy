import express from "express";
import path from "path";
import dotenv from "dotenv-defaults";
import cors from "cors";
import db from "./src/db";
db.connect();
import routes from "./src/routes";

dotenv.config();

const app = express();
app.use(cors());

app.use(express.json());
app.use("/api", routes);

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "../frontend", "build")));
  app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "../frontend", "build", "index.html"));
  });
}

// define server
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server is up on port ${port}.`);
});
