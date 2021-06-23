import Ajv, { JTDDataType } from "ajv/dist/jtd";
const ajv = new Ajv();

enum EWorkstationState {
  offline = "OFFLINE",
  online = "ONLINE",
  restricted = "RESTRICTED",
}

interface IDated {
  created_on: Date;
  edited_on: Date;
}

export interface IWorkstation extends IDated {
  id?: {
    machine?: string;
    boot?: string;
    mac?: string;
  };
  ip_addr: string;
  hostname: string;
  location?: string;
  // last_ping: Date;
  // users_online: string[];
  // state: EWorkstationState;
}

const tdSchema = {
  definitions: {
    id: {
      optionalProperties: {
        machine: { type: "string" },
        boot: { type: "string" },
        mac: { type: "string" },
      },
    },
  },
  properties: {
    ip_addr: { type: "string" },
    hostname: { type: "string" },
  },
  optionalProperties: {
    location: { type: "string" },
    created_on: { type: "timestamp" },
    edited_on: { type: "timestamp" },
    id: {
      ref: "id",
    },
  },
};

export const validate = ajv.compile<IWorkstation>(tdSchema);
export const parse = ajv.compileParser<IWorkstation>(tdSchema);

// var testdata = {
//   ip_addr: "127.0.0.1",
//   hostname: "alarmpi",
//   created_on: new Date(),
// };

// function prout(data: any) {
//   if (validate(data)) {
//     console.log(data);
//     console.log("ok!");
//   } else {
//     console.log(ajv.errorsText(validate.errors));
//   }
// }
// prout(testdata);

// var testdata2 = {
//   ip_addr: "127.0.0.1",
// };

// prout(testdata2);
