import { Request, Response } from "express";
import { HttpStatusCode } from "../../../shared/enums/httpCodes";
import { ISendMessageUseCase } from "../../../application/interfaces/chat/ISendMessageUseCase";
import { IGetMessagesUseCase } from "../../../application/interfaces/chat/IGetMessagesUseCase";
import { ResponseHandler } from "../../../shared/responses/ApiResponse";
import { RESPONSE_MESSAGES } from "../../../shared/responses/ResponseMessages";

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
            return res.status(HttpStatusCode.UNAUTHORIZED).json(
                ResponseHandler.error(RESPONSE_MESSAGES.UNAUTHORIZED)
            );
        }

        if (!chatId || !receiverId || (!message && !attachmentUrl)) {
            return res.status(HttpStatusCode.BAD_REQUEST).json(
                ResponseHandler.error(RESPONSE_MESSAGES.MISSING_FIELDS)
            );
        }

        await this._sendMessageUseCase.execute({
            chatId,
            senderId,
            receiverId,
            message: message || "",
            attachmentUrl,
            messageType: messageType || "text"
        });

        res.status(HttpStatusCode.OK).json(
            ResponseHandler.success(null, RESPONSE_MESSAGES.MESSAGE_SENT)
        );
    };

    getMessages = async (req: Request, res: Response) => {
        const { chatId } = req.params;

        const messages = await this._getMessagesUseCase.execute(chatId);

        res.status(HttpStatusCode.OK).json(
            ResponseHandler.success(messages, RESPONSE_MESSAGES.MESSAGES_FETCHED)
        );
    };
}