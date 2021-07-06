import { IStatus } from "../types/Status";
import { Machine as EntityMachine } from "../entity/Machine";
import { db_conn } from "../db";

export async function intakeStatus(status: IStatus) {
  await db_conn
    .createQueryBuilder()
    .update(EntityMachine)
    .set({ online: false, edited_on: new Date(), ip_addr: "" })
    .where("ip_addr = :1 AND machine_id != :2", {
      1: status.ip_addr,
      2: status.machine_id,
    })
    .execute();

  let machine = await db_conn.manager.findOne(EntityMachine, {
    where: { machine_id: status.machine_id },
  });
  if (machine) {
    // update it
    machine.ip_addr = status.ip_addr;
    machine.boot_id = status.boot_id;
    machine.hostname = status.hostname;
    machine.online = true;
  } else {
    // create it
    machine = new EntityMachine({
      hostname: status.hostname,
      machine_id: status.machine_id,
      boot_id: status.boot_id,
      ip_addr: status.ip_addr,
      online: true,
    });
  }
  await db_conn.manager.save(machine);
}
