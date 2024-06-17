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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Patient.name, schema: PatientSchema },
      { name: Biodata.name, schema: BiodataSchema },
      { name: Prescription.name, schema: PrescriptionSchema },
      { name: Appointment.name, schema: AppointmentSchema },
      { name: Treatment.name, schema: TreatmentSchema },
    ]),
  ],
  controllers: [PatientController],
  providers: [PatientService],
  exports: [PatientService],
})
export class PatientModule {}
