/* eslint-disable @typescript-eslint/no-var-requires */
import type { NextApiRequest, NextApiResponse } from "next";
const { readFileSync } = require('fs');
const { join } = require('path');
import sgMail from "@sendgrid/mail";

import { prisma } from "../../../../auth/db";

import { env } from "env/server.mjs";

sgMail.setApiKey(env.SENDGRID_API_KEY);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { adminName, onboardingProgramName, talentEmails, organizationId, onboardingProgramId } = req.body;

        // get organization name from organizationId
        const organization = await prisma.organization.findUnique({
            where: {
                id: organizationId,
            },
        });

        const organizationName = organization?.name;

        // validate the data coming in
        if (!adminName || !onboardingProgramName || !organizationName || !talentEmails) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const path = join(process.cwd(), "src/utils/emails/inviteTalent.html");
        const stringTemplate = readFileSync(path, "utf8");

        // email link: staging.navu360.com/onboarding/organizationId/onboardingProgramId

        const link = `${process.env.NODE_ENV === "production" ? "https://navu360.com" : "http://localhost:3000"}/onboarding/${organizationId}/${onboardingProgramId}`

        const createInviteRecord = async (talentEmail: string) => {
            const body = {
                email: talentEmail,
                onboardingProgramId: onboardingProgramId,
            }

            const invite = await prisma.invites.create({
                data: body,
            });

            return invite;
        }

        talentEmails.forEach(async (talentEmail: string) => {
            if (talentEmail === "") {
                console.log("empty email");
            } else {
                const msg = {
                    to: talentEmail,
                    from: {
                        email: env.EMAIL_FROM,
                        name: `Navu360`,
                    },
                    replyTo: env.REPLY_TO,
                    subject: `You've been invited to join to onboarding program: ${onboardingProgramName}`,
                    // email template path src/utils/emails/inviteTalent.html
                    // dynamic data: adminName, onboardingProgram, organizationName, link,firstName
                    html: stringTemplate
                        .replace(/{{adminName}}/g, adminName)
                        .replace(/{{onboardingProgram}}/g, onboardingProgramName)
                        .replace(/{{organizationName}}/g, organizationName)
                        .replace(/{{link}}/g, link).replace(/{{todayYear}}/g, new Date().getFullYear().toString()),

                };

                // @ts-ignore
                await sgMail.send(msg);
                console.log(`email sent to ${talentEmail}`);
                createInviteRecord(talentEmail);

            }

        });

        return res.json({ message: `Talents have been invited to onboarding program: ${onboardingProgramName}` });

    } catch (error) {
        // @ts-ignore
        return res.status(400).json({ error: error.message });
    }
}

export default handler;