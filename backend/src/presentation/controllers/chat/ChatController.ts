import { Request, Response } from "express";
import { ISendMessageUseCase } from "../../../application/interfaces/chat/ISendMessageUseCase";
import { IGetMessagesUseCase } from "../../../application/interfaces/chat/IGetMessagesUseCase";

export class ChatController {

    constructor(
        private readonly _sendMessageUseCase: ISendMessageUseCase,
        private readonly _getMessagesUseCase: IGetMessagesUseCase
    ) { }

    sendMessage = async (req: Request, res: Response) => {
        const { chatId, receiverId, message } = req.body;
        const senderId = req.user.id;

        await this._sendMessageUseCase.execute({
            chatId,
            senderId,
            receiverId,
            message
        });

        res.json({ success: true });
    };

    getMessages = async (req: Request, res: Response) => {
        const { chatId } = req.params;

        const messages = await this._getMessagesUseCase.execute(chatId);

        res.json(messages);
    };
}