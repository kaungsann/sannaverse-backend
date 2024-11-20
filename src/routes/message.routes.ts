import express from "express";
import {
  sendOneToOneMessage,
  getOneToOneMessages,
} from "../controllers/message.controller";
import {
  sendGroupMessage,
  getGroupMessages,
  createGroupChat,
  addGroupMember,
  removeGroupMember,
} from "../controllers/groupMessage.controller";
import auth from "../middlewares/auth";

const router = express.Router();

// One-to-one chat routes
router.post("/one-to-one/send", auth, sendOneToOneMessage);
router.get("/one-to-one/:chatId", getOneToOneMessages);

// Group chat routes
router.post("/group/send", auth, sendGroupMessage);
router.get("/group/:chatId", auth, getGroupMessages);
router.post("/group/create", auth, createGroupChat);
router.post("/group/:chatId/add", auth, addGroupMember);
router.post("/group/:chatId/remove", auth, removeGroupMember);

export default router;
