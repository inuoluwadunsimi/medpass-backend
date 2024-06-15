import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { HospitalService } from "./hospital.service";

@Module({
  imports: [MongooseModule.forFeature([])],
  controllers: [HospitalModule],
  providers: [HospitalService],
})
export class HospitalModule {}
