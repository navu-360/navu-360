/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
const { readFileSync } = require("fs");
const { join } = require("path");
import sgMail from "@sendgrid/mail";

import { env } from "env/server.mjs";
import { prisma } from "auth/db";

sgMail.setApiKey(env.SENDGRID_API_KEY);

const sendEnrolledEmail = async (req: {
  programName: string;
  talentName: string;
  organizationName: string;
  talentId: string;
  originBaseUrl: string;
}) => {
  try {

    const { programName, talentName, organizationName, talentId, originBaseUrl } = req;

    // validate the data coming in
    if (!organizationName || !programName) {
      throw new Error(`Missing fields.`);
    }

    const path = join(process.cwd(), "src/utils/emails/enrolled.html");
    const stringTemplate = readFileSync(path, "utf8");

    // email link: staging.navu360.com/onboarding/organizationId/onboardingProgramId

    // const originBaseUrl = req.headers.origin;

    const link = `${originBaseUrl}`;

    // get talent by talentId
    const talent = await prisma.user.findFirst({
      where: {
        id: talentId,
      },
    });

    if (!talent) {
      throw new Error(`Talent not found.`);
    }

    const msg = {
      to: talent?.email,
      from: {
        email: env.EMAIL_FROM,
        name: `Navu360`,
      },
      replyTo: env.REPLY_TO,
      subject: `You've been enrolled to ${programName}`,
      // email template path src/utils/emails/inviteTalent.html
      html: stringTemplate
        .replace(/{{talentName}}/g, talentName)
        .replace(/{{programName}}/g, programName)
        .replace(/{{organizationName}}/g, organizationName)
        .replace(/{{link}}/g, link)
        .replace(/{{todayYear}}/g, new Date().getFullYear().toString()),
    };

    // @ts-ignore
    await sgMail.send(msg);

    return {
      message: `Email sent to ${talent?.email}`,
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export default sendEnrolledEmail;
