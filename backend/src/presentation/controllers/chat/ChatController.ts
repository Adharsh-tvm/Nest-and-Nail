import { Request, Response } from "express";
import { HttpStatusCode } from "../../../shared/enums/httpCodes";
import { ISendMessageUseCase } from "../../../application/interfaces/chat/ISendMessageUseCase";
import { IGetMessagesUseCase } from "../../../application/interfaces/chat/IGetMessagesUseCase";

export class ChatController {

    constructor(
        private readonly _sendMessageUseCase: ISendMessageUseCase,
        private readonly _getMessagesUseCase: IGetMessagesUseCase
    ) { }

    sendMessage = async (req: Request, res: Response) => {
        const { chatId, receiverId, message, attachmentUrl, messageType } = req.body as { 
            chatId?: string; 
            receiverId?: string; 
            message?: string;
            attachmentUrl?: string;
            messageType?: string;
        };
        const senderId = req.user?.id;
        if (!senderId) {
            return res.status(HttpStatusCode.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
        }

        if (!chatId || !receiverId || (!message && !attachmentUrl)) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: "Missing required fields" });
        }

        await this._sendMessageUseCase.execute({
            chatId,
            senderId,
            receiverId,
            message: message || "",
            attachmentUrl,
            messageType: messageType || "text"
        });

        res.json({ success: true });
    };

    getMessages = async (req: Request, res: Response) => {
        const { chatId } = req.params;

        const messages = await this._getMessagesUseCase.execute(chatId);

        res.json(messages);
    };
}