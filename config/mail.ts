import nodemailer from "nodemailer";
import { logger } from "../utils/logger.util.js";

const sendMail = async (to: string, subject: string, html: string) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "sheeladecorproject@gmail.com",
                pass: process.env.APP_PASSWORD
            }
        });

        const mailOptions = {
            from: "'Sahani Paints' <sheeladecorproject@gmail.com>",
            to: to,
            subject: subject,
            html
        };

        const info = await transporter.sendMail(mailOptions);
        return info;
    } catch (err: any) {
        logger.warn("Error while sending mail: " + (err.message || err));
    }
};

export { sendMail };
