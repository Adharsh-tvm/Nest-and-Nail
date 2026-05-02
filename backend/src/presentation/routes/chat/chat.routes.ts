import { Router } from "express";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import { ChatController } from "../../controllers/chat/ChatController";

export const chatRoutes = (
    authMiddleware: AuthMiddleware,
    chatController: ChatController
) => {
    const router = Router();

    router.post("/send", authMiddleware.verify.bind(authMiddleware), chatController.sendMessage);
    router.get("/:chatId", authMiddleware.verify.bind(authMiddleware), chatController.getMessages);

    return router;
};