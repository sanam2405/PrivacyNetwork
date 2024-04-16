import mongoose, { Schema, Document, Types } from "mongoose";

export interface UserDocument extends Document {
  name: string;
  username: string;
  email: string;
  password: string;
  Photo?: string;
  age?: number;
  gender?: string;
  college?: string;
  friends: Types.ObjectId[];
  visibility: boolean;
}

const userSchema: Schema<UserDocument> = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  Photo: { type: String },
  age: { type: Number },
  gender: { type: String },
  college: { type: String },
  friends: [{ type: Schema.Types.ObjectId, ref: "user" }],
  visibility: { type: Boolean },
});

const User = mongoose.model<UserDocument>("user", userSchema);

export default User;
