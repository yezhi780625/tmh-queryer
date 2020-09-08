import express from "express";
import findSpace from "./query.js";

const app = express();
const port = process.env.PORT || 3000;

app.get("/", async (req, res) => {
  const spaces = await findSpace();
  console.log(spaces);
  res.send(JSON.stringify(spaces));
});

app.listen(port, () => {
  console.log(`service on port: ${port}`);
});
