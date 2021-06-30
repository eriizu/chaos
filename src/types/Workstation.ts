import Ajv, { JTDDataType } from "ajv/dist/jtd";
const ajv = new Ajv();

enum EWorkstationState {
  offline = "OFFLINE",
  online = "ONLINE",
  restricted = "RESTRICTED",
}

export interface IWorkstation {
  ip_addr: string;
  hostname: string;
  online: boolean;

  machine_id: string;
  boot_id?: string;

  location?: string;
  created_on?: Date;
  edited_on?: Date;
}

const tdSchema = {
  definitions: {},
  properties: {
    hostname: { type: "string" },
    boot_id: { type: "string" },
    machine_id: { type: "string" },
  },
  optionalProperties: {
    ip_addr: { type: "string" },
    online: { type: "boolean" },
    location: { type: "string" },
    created_on: { type: "timestamp" },
    edited_on: { type: "timestamp" },
  },
};

export const validate = ajv.compile<IWorkstation>(tdSchema);
export const parse = ajv.compileParser<IWorkstation>(tdSchema);
