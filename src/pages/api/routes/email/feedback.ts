/* eslint-disable @typescript-eslint/no-var-requires */
import type { NextApiRequest, NextApiResponse } from "next";
const { readFileSync } = require("fs");
const { join } = require("path");
import type { MailDataRequired } from "@sendgrid/mail";
import sgMail from "@sendgrid/mail";

import { env } from "env/server.mjs";
import { prisma } from "auth/db";

sgMail.setApiKey(env.SENDGRID_API_KEY);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    // runs every 24hrs. Checks for users who have joined but no course created within 7 days. Sends email to them.
    try {
        const path = join(process.cwd(), "src/utils/emails/feedback.html");
        const stringTemplate = readFileSync(path, "utf8");

        const sevenDaysAgo = new Date((new Date()).valueOf() - 1000 * 60 * 60 * 24 * 7);
        // @ts-ignore
        const users: {
            name: string,
            email: string
        }[]
            = await prisma.user.findMany({
                where: {
                    createdAt: {
                        gte: sevenDaysAgo
                    },
                    Organization: {
                        // check if count of field freeTrialCoursesIds is 0
                        freeTrialCoursesIds: {
                            isEmpty: true
                        }
                    }
                },
                select: {
                    name: true,
                    email: true
                }
            });

        // we check emailTracking model(email, emailType). We check if we have sent type "feedback" to an email
        const sendEmails = await prisma.emailTracking.findMany({
            where: {
                emailType: "feedback",
                email: {
                    in: users.map((user) => user.email)
                }
            }
        });

        const emailsSent = sendEmails.map((email) => email.email);

        // we filter out emails that have already been sent
        const filteredUsers = users.filter((user) => !emailsSent.includes(user.email));

        filteredUsers.forEach(async (user) => {
            const msg: MailDataRequired = {
                to: user.email as string,
                from: {
                    email: env.EMAIL_FROM,
                    name: `Navu360`,
                },
                replyTo: env.REPLY_TO,
                subject: `Seeking Your Valuable Feedback on Navu360`,
                html: stringTemplate
                    .replace(/{{name}}/g, user.name)
                    .replace(/{{todayYear}}/g, new Date().getFullYear().toString()),
            };
            console.log(msg);
            // await sgMail.send(msg);
            // we add the email to emailTracking model
            await prisma.emailTracking.create({
                data: {
                    email: user.email,
                    emailType: "feedback"
                }
            });
        });



        return res.json({
            message: `Email sent`,
        });
    } catch (error) {
        // @ts-ignore
        return res.status(400).json({ message: error.message });
    }
};

export default handler;
