import nodemailer from "nodemailer";
import { appConfig } from "../config/index";

class MailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: appConfig.mail?.user,
                pass: appConfig.mail?.password,
            },
        });
    }

    async sendMail(to: string, subject: string, html: string) {
        const mailOptions = {
            from: `"EXT Library" <${process.env.MAIL_USER}>`,
            to,
            subject,
            html,
        };

        return await this.transporter.sendMail(mailOptions);
    }
}

export const mailService = new MailService();
