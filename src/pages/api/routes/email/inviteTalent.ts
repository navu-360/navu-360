import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import sgMail from "@sendgrid/mail";


import { env } from "env/server.mjs";

sgMail.setApiKey(env.SENDGRID_API_KEY);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    const { adminName, onboardingProgram, organizationName, talentEmail, organizationId, onboardingProgramId, firstName } = req.body;
    // validate the data coming in
    if (!adminName || !onboardingProgram || !organizationName || !talentEmail) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const filePath = "../../../../utils/emails/inviteTalent.html";
    const stringTemplate = fs.readFileSync(filePath, "utf8");

    // email link: staging.navu360.com/onboarding/organizationId/onboardingProgramId

    const link = `${process.env.NODE_ENV === "production" ? "https://navu360.com" : "http://localhost:3000"}/onboarding/${organizationId}/${onboardingProgramId}`

    const msg = {
        to: talentEmail,
        from: {
            email: process.env.EMAIL_FROM,
            name: `${adminName} from ${organizationName}`,
        },
        replyTo: process.env.REPLY_TO,
        subject: `You've been invited to join to onboarding program: ${onboardingProgram}`,
        // email template path src/utils/emails/inviteTalent.html
        // dynamic data: adminName, onboardingProgram, organizationName, link,firstName
        html: stringTemplate
            .replace(/{{adminName}}/g, adminName)
            .replace(/{{onboardingProgram}}/g, onboardingProgram)
            .replace(/{{organizationName}}/g, organizationName)
            .replace(/{{link}}/g, link)
            .replace(/{{firstName}}/g, firstName),

    };

    try {
        // @ts-ignore
        await sgMail.send(msg);
        return res.json({ message: `${firstName} has been invited to onboarding program: ${onboardingProgram}` });
    } catch (error) {
        res.status(400).json({ error: "There was an error sending the email. Please try again" });
    }

}

export default handler;