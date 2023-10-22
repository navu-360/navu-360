import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "auth/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {

    const id = req.query.id as string;

    const invite = await prisma.invites.findUnique({
      where: {
        id,
      },
    });

    // from invite.orgId, get organization details. From organization.userId get user details
    if (!invite) return res.status(404).json({ message: `Invite not found.` });

    const organization = await prisma.organization.findUnique({
      where: {
        id: invite.orgId!,
      },
      include: {
        user: true,
      },
    });

    console.log("organization", organization)

    return res.status(200).json({ message: `Invite fetched.`, data: { ...invite, ...organization } });
  } catch (error) {
    return res
      .status(500)
      // @ts-ignore
      .json({ message: error.message });
  }
};

export default handler;
