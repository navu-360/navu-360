import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../../auth/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  /*
    API endpoinnt to add user to waitlist. POST request with email.
    If user already exists, return success 200.
    */

  try {
    const { email } = req.body as {
      email: string;
    };

    const waitlist = await prisma.waitlist.findUnique({
      where: {
        email: email,
      },
    });

    if (!waitlist) {
      await prisma.waitlist.create({
        data: {
          email: email,
        },
      });
    }

    return res
      .status(200)
      .json({ message: `Smart move! ${email} added to waitlist.` });
  } catch (error) {
    return res
      .status(500)
      // @ts-ignore
      .json({ message: error.message });
  }
};

export default handler;
