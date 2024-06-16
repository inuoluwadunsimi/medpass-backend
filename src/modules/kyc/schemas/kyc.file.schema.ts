import { ApiProperty } from "@nestjs/swagger";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ _id: false })
export class KYCFile {
  @ApiProperty()
  @Prop({ type: String })
  url: string;

  @ApiProperty()
  @Prop({ type: String })
  public_idd: string;
}

export const KYCFileSchema = SchemaFactory.createForClass(KYCFile);
