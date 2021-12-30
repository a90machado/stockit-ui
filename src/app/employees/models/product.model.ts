import { Employee } from "./employee.model";

export interface Product {
  id?: number;
  name: string;
  description: string;
  serialNumber: string;
  notes: string;
  outOfService: boolean;
  employeeDTO?: Employee;
}
