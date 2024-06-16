import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { HospitalSchema, Hospital } from "../hospital/schemas/hospital.schema";
import { Doctor, DoctorSchema } from "./schema/doctor.schema";
import { User, UserSchema } from "../user/schemas";
import { UserModule } from "../user/user.module";
import { HospitalModule } from "../hospital/hospital.module";
import { Department, DepartmentSchema } from "./schema/department.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Hospital.name, schema: HospitalSchema },
      { name: Doctor.name, schema: DoctorSchema },
      { name: User.name, schema: UserSchema },
      { name: Department.name, schema: DepartmentSchema },
    ]),
    UserModule,
    HospitalModule,
  ],
})
export class DepartmentModule {}
