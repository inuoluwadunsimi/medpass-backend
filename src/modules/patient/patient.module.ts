import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Patient, PatientSchema } from "./schemas/patient.schema";
import { Biodata, BiodataSchema } from "./schemas/biodata.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Patient.name, schema: PatientSchema },
      { name: Biodata.name, schema: BiodataSchema },
    ]),
  ],
})
export class PatientModule {}
