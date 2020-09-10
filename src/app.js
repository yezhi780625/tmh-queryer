import express from "express";
import util from 'util';
import findSpace from "./query.js";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

app.get("/", cors(), async (req, res) => {
  try {
    const spaces = await findSpace();
    res.status(200).send(JSON.stringify(spaces));
  } catch (e) {
    res.status(500).send({error: util.inspect(e)});
  }
});

app.listen(port, () => {
  console.log(`service on port: ${port}`);
});
