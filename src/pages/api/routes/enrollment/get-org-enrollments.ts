import type { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "next-auth";

import { prisma } from "../../../../auth/db";
import { authOptions } from "auth/auth";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      res.status(401).json({ message: `Unauthorized.` });
      return;
    }
    // get all enrollments for a organization
    // receive: organizationId

    // validations: 1) organizationId exists

    const { organizationId } = req.query as { organizationId: string };

    console.time("getOrg");
    const organization = await prisma.organization.findUnique({
      where: {
        id: organizationId,
      },
    });

    console.timeEnd("getOrg");

    if (!organization)
      return res.status(400).json({ error: "Organization not found" });

    console.time("getOrgEnrollments");
    const organizationEnrollments =
      await prisma.onboardingProgramTalents.findMany({
        where: {
          organizationId: organizationId,
        },
        include: {
          User: {
            select: {
              name: true,
              email: true,
              id: true,
              createdAt: true,
            },

          }
        },
        // cacheStrategy: {
        //   ttl: 60,
        //   swr: 10,
        // },
      });
    console.timeEnd("getOrgEnrollments");

    return res
      .status(200)
      .json({
        message: `Organization enrollments found!`,
        data: organizationEnrollments,
      });
  } catch (error) {
    return res
      .status(500)
      // @ts-ignore
      .json({ message: error.message });
  }
};

export default handler;
