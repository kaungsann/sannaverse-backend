import { Schema, model, Document } from "mongoose";

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  avatar?: string;
  status: string;
  lastSeen: Date;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  status: { type: String, default: "offline" },
  lastSeen: { type: Date, default: Date.now },
});

export const User = model<IUser>("User", UserSchema);
