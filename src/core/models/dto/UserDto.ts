import { Status } from "./Status";

export interface UserDto {
  idUser: number;
  username: string;
  lastName: string;
  firstName: string;
  dni: number;
  phone: string;
  status: Status;
  dateRegister: string;
  password: string;
  digitalInvoiceAdhered: boolean;
  residenceDto: ResidenceDto;
}

// ResidenceDto.ts en el frontend
export interface ResidenceDto {
  idResidence?: number | null;
  idLocation: string;
  district: string;
  street: string;
  number: string; // Número de casa
  serialNumber: string; // Serial del medidor
  numberMeter: string; // Número del medidor físico
  idFee: string;
}
