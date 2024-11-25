import { Schema, model, Document, Types } from "mongoose";
import toJSON from "./plugins/toJSON"; // Adjust the path to your toJSON plugin file
import paginate from "./plugins/paginate"; // Adjust the path to your paginate plugin file

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

// Apply plugins to the schema
MessageSchema.plugin(toJSON); // Enables the transformation logic
MessageSchema.plugin(paginate); // Adds pagination functionality

export const Message = model<IMessage>("Message", MessageSchema);
