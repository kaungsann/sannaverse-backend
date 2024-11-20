import { z } from "zod";
import mongoose from "mongoose";

// Define a custom validation for MongoDB ObjectId
export const objectIdSchema = z
  .string()
  .refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "Invalid ObjectId",
  });

export const sendMessageSchema = z.object({
  senderId: objectIdSchema,
  recipientId: objectIdSchema,
  content: z.string().min(1, "Content cannot be empty"),
  media: z.union([z.string(), z.null(), z.undefined()]).optional(), // media can be a string, null, or undefined
  emoji: z.union([z.string(), z.null(), z.undefined()]).optional(), // emoji can be a string, null, or undefined
  voice: z.union([z.string(), z.null(), z.undefined()]).optional(), // voice can be a string, null, or undefined
});
