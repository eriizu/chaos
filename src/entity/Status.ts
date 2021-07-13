import * as orm from "typeorm";
import { IStatus, IStatusIntake } from "../types/Status";
// import { ILoginSession } from "../types/LoginSession";
import { LoginSession } from "./LoginSession";
import * as ctrlMachine from "../controller/MachineController";
import { db_conn } from "../db";

@orm.Entity()
export class Status implements IStatus {
  @orm.PrimaryColumn({ generated: "uuid" })
  id!: string;

  @orm.Column()
  ip_addr!: string;

  @orm.Column()
  hostname!: string;

  @orm.Column()
  boot_id!: string;

  @orm.Index()
  @orm.Column()
  machine_id!: string;

  @orm.Column({ default: () => "CURRENT_TIMESTAMP" })
  on!: Date;

  @orm.Column({ type: "simple-array" })
  logged_in?: string[];

  constructor(src: IStatusIntake) {
    if (!src) return;
    this.boot_id = src.boot_id;
    this.machine_id = src.machine_id;
    this.ip_addr = src.ip_addr;
    this.hostname = src.hostname;
    this.on = src.on || new Date();
    this.logged_in = src.logged_in;
  }

  @orm.BeforeInsert()
  cleanUUID() {
    this.boot_id = this.boot_id.replaceAll("-", "");
    this.machine_id = this.machine_id.replaceAll("-", "");
  }

  @orm.AfterInsert()
  async intakeStatus() {
    await ctrlMachine.intakeStatus(this);
  }
}
