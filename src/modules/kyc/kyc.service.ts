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
  public async UploadKycDocument(body: uploadKyc): Promise<void> {
    const { hospitalId, file, kycType } = body;
    if (kycType === KycEnums.MEDICAL_LICENSE) {
      // logic for them
    }

    const kycExists = await this.KYCModel.findOne({
      hospital: hospitalId,
      kycType: kycType,
    });
    if (kycExists) {
      throw new BadRequestException("document already uploaded");
    }

    const uploadedResult = this.cloudinaryService.uploadImage(file);
    await this.KYCModel.create({
      file: uploadedResult,
      kycType: kycType,
      uploaded: true,
      hospital: hospitalId,
    });

    const kycDetails = await this.KYCModel.find({
      hospital: hospitalId,
    }).countDocuments();
    if (kycDetails > 2) {
      await this.hospitalModel.updateOne(
        { _id: hospitalId },
        {
          kycVerified: true,
        }
      );
    }

    // do logic for doctor
  }
}
