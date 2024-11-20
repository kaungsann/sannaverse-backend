import { Request, Response } from "express";
import { Message } from "../models/message.model";
import { Chat } from "../models/chat.model";

// Send a group message
export const sendGroupMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { senderId, chatId, content, media, emoji, voice } = req.body;

    if (!senderId || !chatId) {
      res.status(400).json({ error: "Sender and chatId are required" });
      return;
    }

    const message = await Message.create({
      sender: senderId,
      chat: chatId,
      content,
      media,
      emoji,
      voice,
      readBy: [senderId],
    });

    await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id });

    res.status(201).json({ message });
  } catch (error) {
    console.error("Error sending group message:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get group messages for a chat
export const getGroupMessages = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const chatId = req.params.chatId;

    const messages = await Message.find({ chat: chatId }).populate(
      "sender",
      "username email"
    );
    res.status(200).json({ messages });
  } catch (error) {
    console.error("Error retrieving messages:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
