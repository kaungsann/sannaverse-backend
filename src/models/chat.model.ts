import { Schema, model, Document, Types } from "mongoose";

import toJSON from "./plugins/toJSON"; // Adjust the path to your toJSON plugin file
import paginate from "./plugins/paginate"; // Adjust the path to your paginate plugin file

interface IChat extends Document {
  isGroupChat: boolean;
  participants: Types.ObjectId[];
  groupName?: string;
  groupAvatar?: string;
  blockedUsers: Types.ObjectId;
  lastMessage?: Types.ObjectId;
  createdAt: Date;
}

const ChatSchema = new Schema<IChat>({
  isGroupChat: { type: Boolean, default: false },
  participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
  groupName: { type: String },
  groupAvatar: { type: String },
  blockedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
  createdAt: { type: Date, default: Date.now },
});

// Apply plugins to the schema
ChatSchema.plugin(toJSON); // Enables the transformation logic
ChatSchema.plugin(paginate); // Adds pagination functionality

export const Chat = model<IChat>("Chat", ChatSchema);
