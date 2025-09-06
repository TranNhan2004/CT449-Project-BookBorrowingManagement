import nodemailer from "nodemailer";
import { appConfig } from "../config/index";

class EmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: appConfig.email?.user,
                pass: appConfig.email?.password,
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

export const emailService = new EmailService();
