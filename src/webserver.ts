import express from "express";
import * as stations from "./types/Workstation";
import * as status from "./types/Status";
import { Status as EntityStatus } from "./entity/Status";
import { Machine as EntityMachine } from "./entity/Machine";

import { idempotency, getSharedIdempotencyService } from "express-idempotency";

import * as orm from "typeorm";
import * as db from "./db";
import * as ctrlMachine from "./controller/MachineController";
import { randomBytes } from "crypto";

// Create your database in the test folder.
// (This is where your JSDF files – “tables” – will be saved.)
//

let db_conn: orm.Connection;

let secret: string;

function generateSecret() {
  let buffer = randomBytes(256);

  secret = buffer.toString("hex");
  console.log("use admin secret " + secret);
}

let webserv = express();
webserv.use(express.json());
webserv.use(express.urlencoded());
webserv.post("*", idempotency());

webserv.all("*", function (req, _res, next) {
  const idempotencyService = getSharedIdempotencyService();
  if (idempotencyService.isHit(req)) {
    console.log(
      "Idempotency middleware did already process the request from " +
        req.ip +
        ". on: " +
        req.originalUrl
    );
    return;
  }

  next();
});

webserv.all("*", (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) console.warn("unauthorized " + req.ip + " on " + req.method + " " + req.originalUrl);
  else if (!token.endsWith(secret))
    console.warn("bad token from " + req.ip + " on " + req.method + " " + req.originalUrl);
  else console.log(req.ip + " authorised on " + req.method + " " + req.originalUrl);
  next();
});

webserv.post("/status", async (req, res) => {
  let body = req.body;
  if (status.validate(body)) {
    let status_entry = new EntityStatus(body);
    try {
      await db_conn.manager.save(status_entry);
      res.status(201).send(status_entry);
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  } else {
    res.status(400).send(status.validate.errors);
  }
});

webserv.post("/stations", (req, res) => {
  let body = stations.validate(req.body);
  if (body) {
    console.log(body);
    res.sendStatus(200);
  } else {
    res.status(400).send({ err: stations.validate.errors });
  }
});

webserv.get("/stations", async (req, res, error) => {
  try {
    let machines = await db_conn.manager.find(EntityMachine);

    res.send(machines);
  } catch (err) {
    error(err);
  }
});

webserv.delete("/stations/:id", async (req, res, error) => {
  try {
    let id = req.params.id;
    let delres = await db_conn.manager.softDelete(EntityMachine, { id });
    if (delres.affected) res.status(200).send(delres);
    else res.sendStatus(404);
  } catch (err) {
    error(err);
  }
  // error(Error("not implemented"));
});

let port = 3000;

db.init().then((connection) => {
  console.log("[SUCCESS] orm connected");
  db_conn = connection;
  webserv.listen(port, () => {
    console.log("[SUCCESS] listening on: " + port.toString());
  });
});
generateSecret();
