import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { KYC, KYCDocument } from "./schemas/kyc.schema";
import { Model } from "mongoose";

import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { uploadKyc } from "./interfaces";
import { KycEnums } from "./enums/kyc.enums";
import {
  Hospital,
  HospitalDocument,
} from "../hospital/schemas/hospital.schema";

@Injectable()
export class KycService {
  constructor(
    @InjectModel(KYC.name) private KYCModel: Model<KYCDocument>,
    @InjectModel(Hospital.name) private hospitalModel: Model<HospitalDocument>,
    private readonly cloudinaryService: CloudinaryService
  ) {}
  public async UploadHospitalKYCDocument(body: uploadKyc): Promise<void> {
    const { hospitalId, files, kycType } = body;
    const uploadResults = await Promise.all(
      files.map((file) => this.cloudinaryService.uploadImage(file))
    );

    for (let i = 0; i < files.length; i++) {
      const uploadedResult = uploadResults[i];
      await this.KYCModel.create({
        kycType: kycType[i],
        file: uploadedResult,
        hospital: hospitalId,
      });
    }

    await this.hospitalModel.updateOne(
      { _id: hospitalId },
      {
        kycVerified: true,
      }
    );
  }
}
