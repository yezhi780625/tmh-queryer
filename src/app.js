import express from "express";
import findSpace from "./query.js";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

app.get("/", cors(), async (req, res) => {
  const spaces = await findSpace();
  res.send(JSON.stringify(spaces));
});

app.listen(port, () => {
  console.log(`service on port: ${port}`);
});
