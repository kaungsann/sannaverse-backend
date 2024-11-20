import { Request, Response } from "express";
import { Message } from "../models/message.model";
import { Chat } from "../models/chat.model";
import { Types } from "mongoose";
import {
  sendMessageSchema,
  objectIdSchema,
} from "../validations/message.validation";

// Send a one-to-one message
export const sendOneToOneMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Validate request body using Zod
    const result = sendMessageSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({ error: result.error.errors });
      return;
    }

    const { senderId, recipientId, content, media, emoji, voice } = result.data;

    console.log("result data is a", result.data);

    if (!senderId || !recipientId) {
      res.status(400).json({ error: "Sender and recipient are required" });
      return;
    }

    // Check if a chat exists
    let chat = await Chat.findOne({
      isGroupChat: false,
      participants: { $all: [senderId, recipientId] },
    });

    if (!chat) {
      chat = await Chat.create({
        isGroupChat: false,
        participants: [senderId, recipientId],
      });
    }

    const message = await Message.create({
      sender: senderId,
      receiver: recipientId,
      chat: chat._id as Types.ObjectId,
      content,
      media,
      emoji,
      voice,
      readBy: [senderId],
    });

    console.log("message is a", message);

    // Explicitly cast message._id to ObjectId when updating lastMessage
    chat.lastMessage = message._id as Types.ObjectId;
    await chat.save();

    res.status(201).json({ message, chat });
  } catch (error) {
    console.error("Error sending message:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get one-to-one messages for a chat
export const getOneToOneMessages = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const chatIdValidation = objectIdSchema.safeParse(req.params.chatId);

    if (!chatIdValidation.success) {
      res.status(400).json({ error: "Invalid chatId parameter" });
      return;
    }

    const messages = await Message.find({
      chat: req.params.chatIdchatId,
    }).populate("sender", "username email");
    res.status(200).json({ messages });
  } catch (error) {
    console.error("Error retrieving messages:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
