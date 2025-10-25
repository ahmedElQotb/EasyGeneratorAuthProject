import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

@Schema()
export class User {

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);