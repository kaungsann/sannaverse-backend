import { Schema, model, Document, Types } from "mongoose";

interface IMessage extends Document {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  chat: Types.ObjectId;
  content?: string;
  media?: string;
  emoji?: string;
  voice?: string;
  readBy: Types.ObjectId[];
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  receiver: { type: Schema.Types.ObjectId, ref: "User" },
  chat: { type: Schema.Types.ObjectId, ref: "Chat" },
  content: { type: String },
  media: { type: String },
  emoji: { type: String },
  voice: { type: String },
  readBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

export const Message = model<IMessage>("Message", MessageSchema);
