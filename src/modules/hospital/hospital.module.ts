import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { HospitalService } from "./hospital.service";
import { HospitalSchema, Hospital } from "./schemas/hospital.schema";
import { HospitalController } from "./hospital.controller";
import { RolesGuard } from "../auth/guards/roles.guard";
import { AppAuthGuard } from "../auth/guards/auth.guard";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Hospital.name, schema: HospitalSchema },
    ]),
  ],
  controllers: [HospitalController],
  providers: [HospitalService, RolesGuard, AppAuthGuard, JwtService],
  exports: [MongooseModule, HospitalService],
})
export class HospitalModule {}
