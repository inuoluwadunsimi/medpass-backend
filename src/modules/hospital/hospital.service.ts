import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Hospital, HospitalDocument } from "./schemas/hospital.schema";
import { CreateHospitalDto } from "./dtos/create-hospital.dto";

@Injectable()
export class HospitalService {
  constructor(
    @InjectModel(Hospital.name) private hospitalModel: Model<HospitalDocument>
  ) {}

  public async createHospital(
    body: CreateHospitalDto,
    user: string
  ): Promise<HospitalDocument> {
    return await this.hospitalModel.create({
      created_by: user,
      ...body,
    });
  }

  public async getHospitalProfile(
    hospitalId: string
  ): Promise<HospitalDocument> {
    const hospital = await this.hospitalModel.findOne<HospitalDocument>({
      _id: hospitalId,
    });
    if (!hospital) {
      throw new NotFoundException("hospital not found");
    }

    return hospital;
  }
}
