import Ajv, { JTDDataType } from "ajv/dist/jtd";
import { ILoginSession } from "./LoginSession";
const ajv = new Ajv();

interface IBaseStatus {
  ip_addr: string;
  hostname: string;
  boot_id: string;
  machine_id: string;
  on: Date | null;
  logged_in?: string[];
}

export interface IStatus extends IBaseStatus {}

export interface IStatusIntake extends IBaseStatus {}

const tdSchema = {
  properties: {
    ip_addr: { type: "string" },
    hostname: { type: "string" },
    boot_id: { type: "string" },
    machine_id: { type: "string" },
  },
  optionalProperties: {
    on: { type: "timestamp" },
    logged_in: { elements: { type: "string" } },
  },
};

export const validate = ajv.compile<IStatusIntake>(tdSchema);
export const parse = ajv.compileParser<IStatusIntake>(tdSchema);
