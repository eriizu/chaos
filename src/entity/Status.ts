import * as orm from "typeorm";
import { IStatus } from "../types/Status";

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

  @orm.Column({ type: "simple-array", nullable: true })
  logged_in?: string[];

  constructor(src: IStatus) {
    Object.assign(this, src);
  }
}
