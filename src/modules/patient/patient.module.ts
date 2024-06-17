import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Patient, PatientSchema } from "./schemas/patient.schema";
import { Biodata, BiodataSchema } from "./schemas/biodata.schema";
import {
  Appointment,
  AppointmentSchema,
  Prescription,
  PrescriptionSchema,
  Treatment,
  TreatmentSchema,
} from "./schemas/appointment.schema";
import { PatientController } from "./patient.controller";
import { PatientService } from "./patient.service";
import { User, UserSchema } from "../user/schemas";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Patient.name, schema: PatientSchema },
      { name: Biodata.name, schema: BiodataSchema },
      { name: Prescription.name, schema: PrescriptionSchema },
      { name: Appointment.name, schema: AppointmentSchema },
      { name: Treatment.name, schema: TreatmentSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [PatientController],
  providers: [PatientService, JwtService],
  exports: [PatientService],
})
export class PatientModule {}
