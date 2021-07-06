import * as orm from "typeorm";
import { IWorkstation } from "../types/Workstation";

@orm.Entity()
export class Machine implements IWorkstation {
  @orm.PrimaryColumn({ generated: "uuid" })
  id!: string;

  @orm.Index()
  @orm.Column({})
  ip_addr!: string;

  @orm.Column()
  hostname!: string;

  @orm.Column()
  online!: boolean;

  @orm.Column({ nullable: true })
  boot_id?: string;

  @orm.Column()
  machine_id!: string;

  @orm.Column({ nullable: true })
  location?: string;

  @orm.Column({ default: () => "CURRENT_TIMESTAMP" })
  created_on?: Date;

  @orm.Column({ default: () => "CURRENT_TIMESTAMP" })
  edited_on?: Date;

  @orm.DeleteDateColumn({})
  deleted_on?: Date;

  constructor(src: IWorkstation) {
    Object.assign(this, src);
  }

  // @orm.BeforeInsert()
  // setDates() {
  //   if (!this.created_on) this.created_on = new Date();
  //   this.edited_on = new Date();
  // }

  @orm.BeforeUpdate()
  bumpDate() {
    this.edited_on = new Date();
  }
}
