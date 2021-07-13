import { IStatus } from "../types/Status";
import { IWorkstation } from "../types/Workstation";

export interface ILoginSession {
  username: string;
  start: Date;
  end?: Date;
  // status: IStatus[];
  station?: IWorkstation;
}
