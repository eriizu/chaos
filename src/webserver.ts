import express from "express";
import * as stations from "./types/Workstation";
import * as status from "./types/Status";
import { Status as EntityStatus } from "./entity/Status";

import { idempotency, getSharedIdempotencyService } from "express-idempotency";

import * as orm from "typeorm";

// Create your database in the test folder.
// (This is where your JSDF files – “tables” – will be saved.)
//

let db_conn: orm.Connection;

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

webserv.post("/status", async (req, res) => {
  let body = req.body;
  if (status.validate(body)) {
    let status = new EntityStatus(body);
    try {
      await db_conn.manager.save(status);
      res.status(201).send(status);
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  } else {
    res.status(400).send(status.validate.errors);
  }
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

orm.createConnection().then((connection) => {
  console.log("[SUCCESS] orm connected to ", connection.name);
  db_conn = connection;
  webserv.listen(3000, () => {
    console.log("listening");
  });
});
