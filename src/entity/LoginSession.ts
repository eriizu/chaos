import * as orm from "typeorm";
import { ILoginSession } from "../types/LoginSession";
import { Status } from "./Status";
import { Machine } from "./Machine";

@orm.Entity()
export class LoginSession implements ILoginSession {
  @orm.PrimaryColumn({ generated: "increment" })
  id!: number;

  @orm.Column()
  username: string;

  @orm.CreateDateColumn()
  start!: Date;

  @orm.Column()
  end?: Date;

  // @orm.ManyToMany(() => Status, (status) => status.logged_in)
  // status!: Status[];

  // @orm.ManyToOne(() => Machine, { nullable: true, cascade: true })
  // station?: Machine;

  constructor(user: string) {
    this.username = user;
  }
}
