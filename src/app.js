import express from "express";
import util from "util";
import findSpace from "./query.js";
import cors from "cors";
import DateFns from "date-fns";
const { parseISO, addDays } = DateFns;

const app = express();
const port = process.env.PORT || 3000;

app.get("/", cors(), async (req, res) => {
  try {
    let { fromDate, toDate, days } = req.query;
    fromDate = fromDate ? parseISO(fromDate) : new Date();
    toDate = toDate ? addDays(parseISO(toDate), 1) : addDays(fromDate, 29);
    const spaces = await findSpace(fromDate, toDate, days);
    res.status(200).send(JSON.stringify(spaces));
  } catch (e) {
    res.status(500).send({ error: util.inspect(e) });
  }
});

app.listen(port, () => {
  console.log(`service on port: ${port}`);
});
