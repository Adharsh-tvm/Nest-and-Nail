import nodemailer from "nodemailer";

import { IEmailService } from "../../application/contracts/IEmailService";
import { env } from "../../config/env";

export class NodemailerEmailService implements IEmailService {

    private transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: env.EMAIL_USER,
            pass: env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    async sendEmail(to: string, subject: string, html: string): Promise<void> {
        await this.transporter.sendMail({
            from: env.EMAIL_USER,
            to,
            subject,
            html
        });
    }
}