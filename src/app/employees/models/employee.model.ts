import { Credential } from "./credential.model";

export interface Employee {
  firstName: string;
  lastName: string;
  employeeNumber: string;
  role: string;
  market: string;
  startDate: Date;
  id?: number;
  endDate?: Date;
}
