import Ajv, { JTDDataType } from "ajv/dist/jtd";
const ajv = new Ajv();

export interface IStatus {
  ip_addr: string;
  hostname: string;
  boot_id: string;
  machine_id: string;
  on: Date | null;
  logged_in?: string[];
}

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

export const validate = ajv.compile<IStatus>(tdSchema);
export const parse = ajv.compileParser<IStatus>(tdSchema);
