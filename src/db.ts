import * as orm from "typeorm";

export let db_conn: orm.Connection;

export const getConn = () => {
  return db_conn;
};

export const init: () => Promise<orm.Connection> = async () => {
  db_conn = await orm.createConnection();
  return db_conn;
};
