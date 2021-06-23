import * as orm from "typeorm";
import { Status } from "./entity/Status";

orm
  .createConnection()
  .then(async (connection) => {
    console.log("connection to db ok");
    let status = new Status({
      boot_id: "tata",
      hostname: "alarmpi",
      ip_addr: "12",
      machine_id: "machine",
      on: new Date(),
    });
    status.logged_in = ["riri", "fifi", "loulou"];
    await connection.manager.save(status);
    console.log("managed to save", status.id);

    let res = await connection.manager.findOne(Status);
    console.log(res);
    if (res) {
      res.logged_in?.push("prout");
      await connection.manager.save(res);
    }
  })
  .catch(console.error);

let hello: string = "hello world";

console.log(hello);
require("./webserver");
