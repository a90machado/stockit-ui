import { Credential } from "./credential.model";

export interface Employee {
  firstName: string;
  lastName: string;
  employeeNumber: string;
  jobTitle: string;
  department: string;
  officeLocation: string;
  phoneNumber: string;
  email: string;
  startDate: Date;
  id?: number;
  endDate?: Date;
}
