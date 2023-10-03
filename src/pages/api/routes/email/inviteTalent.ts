/* eslint-disable @typescript-eslint/no-var-requires */
import type { NextApiRequest, NextApiResponse } from "next";
const { readFileSync } = require("fs");
const { join } = require("path");
import sgMail from "@sendgrid/mail";

import { prisma } from "../../../../auth/db";

import { env } from "env/server.mjs";

sgMail.setApiKey(env.SENDGRID_API_KEY);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { adminName, talentEmails, organizationId } = req.body;

    // get organization name from organizationId
    const organization = await prisma.organization.findUnique({
      where: {
        id: organizationId,
      },
    });

    const organizationName = organization?.name;

    // validate the data coming in
    if (!adminName || !organizationName || !talentEmails) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const path = join(process.cwd(), "src/utils/emails/inviteTalent.html");
    const stringTemplate = readFileSync(path, "utf8");

    // email link: staging.navu360.com/onboarding/organizationId/onboardingProgramId
    const originBaseUrl = req.headers.origin;

    const baseLink = `${originBaseUrl}/invite`;

    const createInviteRecord = async (talentEmail: string) => {
      const body = {
        email: talentEmail,
        orgId: organizationId,
      };

      const invite = await prisma.invites.create({
        data: body,
      });

      const link = `${baseLink}/${invite.id}`;

      return link
    };

    talentEmails.forEach(async (talentEmail: string) => {
      if (talentEmail === "") {
        console.log("empty email");
      } else {
        const inviteLink = await createInviteRecord(talentEmail);
        const msg = {
          to: talentEmail,
          from: {
            email: env.EMAIL_FROM,
            name: `Navu360`,
          },
          replyTo: env.REPLY_TO,
          subject: `You've been invited to join ${organizationName}`,
          // email template path src/utils/emails/inviteTalent.html
          // dynamic data: adminName, onboardingProgram, organizationName, link,firstName
          html: stringTemplate
            .replace(/{{adminName}}/g, adminName)
            .replace(/{{organizationName}}/g, organizationName)
            .replace(/{{link}}/g, inviteLink)
            .replace(/{{todayYear}}/g, new Date().getFullYear().toString()),
        };

        // @ts-ignore
        await sgMail.send(msg);
      }
    });

    return res.json({
      message: `Talents have been invited to ${organizationName}`,
    });
  } catch (error) {
    // @ts-ignore
    return res.status(400).json({ message: error.message });
  }
};

export default handler;
