import { z } from "zod";
import mongoose from "mongoose";

// Define a custom validation for MongoDB ObjectId
export const objectIdSchema = z
  .string()
  .refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "Invalid ObjectId",
  });

// Define the schema for the request payload
export const addGroupMemberSchema = z.object({
  userIds: z.array(objectIdSchema).min(1, "At least one userId is required"),
});

// Schema for sending a group message
export const sendGroupMessageSchema = z.object({
  senderId: objectIdSchema,
  chatId: objectIdSchema,
  content: z.string().optional(),
  media: z.string().optional(),
  emoji: z.string().optional(),
  voice: z.string().optional(),
});

// Schema for creating a group chat
export const createGroupChatSchema = z.object({
  groupName: z.string().min(1, "Group name is required"),
  groupAvatar: z.string().optional(),
  participants: z
    .array(objectIdSchema)
    .min(1, "At least one participant is required"),
});

// Schema for removing a group member
export const removeGroupMemberSchema = z.object({
  userId: objectIdSchema,
});
