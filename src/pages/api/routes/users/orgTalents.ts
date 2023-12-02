import type { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "next-auth";

import { prisma } from "../../../../auth/db";
import { authOptions } from "auth/auth";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  /*
    Get all talents for an organization
   */
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ message: `Unauthorized.` });
    return;
  }

  try {

    // using user id, we get the org
    const organization = await prisma.organization.findFirst({
      where: {
        userId: session?.user?.id as string,
      },
      select: {
        id: true,
      },
      // cacheStrategy: {
      //   ttl: 60,
      //   swr: 10,
      // },
    });


    // find all users with role of talent and orgId
    const users = await prisma.user.findMany({
      where: {
        talentOrgId: organization?.id,
        role: "talent",
      },
      // cacheStrategy: {
      //   ttl: 60,
      //   swr: 10,
      // },
    });

    return res.status(200).json({ message: `Users found.`, data: users });
  } catch (error) {
    return res
      .status(500)
      // @ts-ignore
      .json({ message: error.message });
  }
};

export default handler;
