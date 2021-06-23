import express from "express";
import * as stations from "./types/Workstation";
import { idempotency, getSharedIdempotencyService } from "express-idempotency";

// Create your database in the test folder.
// (This is where your JSDF files – “tables” – will be saved.)
//

let webserv = express();
webserv.use(express.json());
webserv.post("*", idempotency());

webserv.all("*", function (req, _res, next) {
  const idempotencyService = getSharedIdempotencyService();
  if (idempotencyService.isHit(req)) {
    console.log("Idempotency middleware did already process the request from " + req.ip + ".");
    return;
  }

  next();
});

webserv.post("/stations", (req, res) => {
  console.log(req.body);
  let body = stations.validate(req.body);
  if (body) {
    console.log(body);
    res.sendStatus(200);
  } else {
    res.status(400).send({ err: stations.validate.errors });
  }
});

webserv.listen(3000, () => {
  console.log("listening");
});
