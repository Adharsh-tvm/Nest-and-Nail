import { Router } from "express";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import { ChatController } from "../../controllers/chat/ChatController";

export const chatRoutes = (
    authMiddleware: AuthMiddleware,
    chatController: ChatController
) => {
    const router = Router();

    router.post("/send", authMiddleware.verify.bind(authMiddleware), (req, res) => { void chatController.sendMessage(req, res); });
    router.get("/:chatId", authMiddleware.verify.bind(authMiddleware), (req, res) => { void chatController.getMessages(req, res); });

    return router;
};