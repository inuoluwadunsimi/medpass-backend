import { ApiProperty } from "@nestjs/swagger";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ _id: false })
export class Biodata {
  @ApiProperty()
  @Prop({ type: String })
  genotype: string;

  @ApiProperty()
  @Prop({ type: String })
  bloodGroup: string;

  @ApiProperty()
  @Prop({ type: String })
  gender: string;

  @ApiProperty()
  @Prop({ type: String })
  maritalStatus: string;
}

export const BiodataSchema = SchemaFactory.createForClass(Biodata);
