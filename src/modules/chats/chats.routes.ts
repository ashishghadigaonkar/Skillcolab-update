import { Router } from "express";
import { chatsController } from "./chats.controller";

const router = Router();

// Conversations & threads compatibility
router.get("/api/chats", chatsController.getConversations);
router.post("/api/chats", chatsController.createConversation);

// Messages routes
router.get("/api/messages/conversations", chatsController.getConversations);
router.post("/api/messages/conversations/create", chatsController.createConversation);
router.get("/api/messages/:conversationId", chatsController.getConversationById);
router.post("/api/messages/send", chatsController.sendMessage);
router.post("/api/messages/reaction", chatsController.addReaction);
router.post("/api/messages/edit", chatsController.editMessage);
router.post("/api/messages/delete", chatsController.deleteMessage);
router.post("/api/messages/pin", chatsController.pinMessage);

export default router;
