import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { HospitalSchema, Hospital } from "../hospital/schemas/hospital.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Hospital.name, schema: Hospital }]),
  ],
})
export class DepartmentModule {}
