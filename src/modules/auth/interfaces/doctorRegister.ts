import { SignupDto } from "../dtos/signup.dto";

export interface DoctorRegister {
  token: string;
  deviceId: string;
  body: SignupDto;
}
