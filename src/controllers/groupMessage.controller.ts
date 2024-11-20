import { Request, Response } from "express";
import { Message } from "../models/message.model";
import { Chat } from "../models/chat.model";
import mongoose from "mongoose";

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

    const messages = await Message.find({ chat: chatId });
    res.status(200).json({ messages });
    return;
  } catch (error) {
    console.error("Error retrieving messages:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//Create Group for a chat
export const createGroupChat = async (req: Request, res: Response) => {
  try {
    const { groupName, groupAvatar, participants } = req.body;

    if (!groupName || !participants || participants.length === 0) {
      res
        .status(400)
        .json({ error: "Group name and participants are required" });
      return;
    }

    const groupChat = await Chat.create({
      isGroupChat: true,
      groupName,
      groupAvatar,
      participants,
    });

    res.status(201).json({ groupChat });
  } catch (error) {
    console.error("Error creating group chat:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//add Group member for a chat
export const addGroupMember = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    const { userIds } = req.body; // Expecting an array of user IDs

    const chat = await Chat.findById(chatId);
    if (!chat) {
      res.status(404).json({ error: "Chat not found" });
      return;
    }

    if (!chat.isGroupChat) {
      res.status(400).json({ error: "Not a group chat" });
      return;
    }

    // const newMembers = userIds.filter(
    //   (userId: string) => !chat.participants.includes(userId)
    // );

    // Ensure all IDs are treated as ObjectId
    const newMembers = userIds.filter((userId: string) => {
      const objectId = new mongoose.Types.ObjectId(userId);
      return !chat.participants.some((participantId) =>
        participantId.equals(objectId)
      );
    });

    if (newMembers.length === 0) {
      res.status(400).json({ error: "All users are already in the group" });
      return;
    }

    chat.participants.push(...newMembers); // Add only non-duplicate users
    await chat.save();

    res.status(200).json({ message: "Users added to group", newMembers });
  } catch (error) {
    console.error("Error adding group members:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//add Group member for a chat
export const removeGroupMember = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    const { userId } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      res.status(404).json({ error: "Chat not found" });
      return;
    }

    if (!chat.isGroupChat) {
      res.status(400).json({ error: "Not a group chat" });
      return;
    }

    chat.participants = chat.participants.filter(
      (participant) => participant.toString() !== userId
    );

    await chat.save();

    res.status(200).json({ message: "User removed from group" });
  } catch (error) {
    console.error("Error removing group member:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
