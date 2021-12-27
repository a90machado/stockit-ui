import { Employee } from "./employee.model";

export interface Credential {
  id?: number,
  type: string,
  username: string,
  password: string,
  notes: string
  employeeDTO?: Employee;
}
