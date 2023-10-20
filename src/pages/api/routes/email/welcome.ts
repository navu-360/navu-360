/* eslint-disable @typescript-eslint/no-var-requires */
import type { NextApiRequest, NextApiResponse } from "next";
const { readFileSync } = require("fs");
const { join } = require("path");
import sgMail from "@sendgrid/mail";

import { env } from "env/server.mjs";


import { getServerSession } from "next-auth";
import { authOptions } from 'auth/auth';

sgMail.setApiKey(env.SENDGRID_API_KEY);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {

    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      res.status(401).json({ message: `Unauthorized.` });
      return;
    }

    const path = join(process.cwd(), "src/utils/emails/welcome.html");
    const stringTemplate = readFileSync(path, "utf8");

    const msg = {
      to: session?.user?.email,
      from: {
        email: env.EMAIL_FROM,
        name: `Navu360`,
      },
      replyTo: env.REPLY_TO,
      subject: `Welcome to Navu360!`,
      html: stringTemplate.replace(/{{adminName}}/g, session?.user?.name),
    };

    // @ts-ignore
    await sgMail.send(msg);

    return res.json({
      message: `Email sent`,
    });
  } catch (error) {
    // @ts-ignore
    return res.status(400).json({ message: error.message });
  }
};

export default handler;
