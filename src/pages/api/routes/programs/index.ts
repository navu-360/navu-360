import type { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "next-auth";

import { prisma } from "auth/db";
import { authOptions } from "auth/auth";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  /*
    API endpoint to 1) create a new program. POST request
    */

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ message: `Unauthorized.` });
    return;
  }

  switch (req.method) {
    case "POST":
      try {
        // name, content
        const { name, content } = req.body as {
          name: string;
          content: string;
        };

        const organization = await prisma.organization.findFirst({
          where: {
            userId: session?.user?.id as string,
          },
          select: {
            id: true,
          }
        });

        if (!organization) return res.status(404).json({ message: `Organization not found.` });

        const program = await prisma.onboardingProgram.create({
          data: {
            name,
            content,
            createdBy: session?.user?.id,
            organizationId: organization.id,
          },
        });

        return res
          .status(200)
          .json({ message: `Program created.`, data: program });
      } catch (error) {
        return res
          .status(500)
          // @ts-ignore
          .json({ message: error.message });
      }

    case "GET":
      try {
        const { orgId } = req.query as { orgId: string };
        const programs = await prisma.onboardingProgram.findMany({
          where: {
            organizationId: orgId,
          },
          select: {
            id: true,
            name: true,
            organizationId: true,
            createdAt: true,
            updatedAt: true,
            createdBy: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          cacheStrategy: {
            ttl: 30,
            swr: 60,
          },
        });

        return res
          .status(200)
          .json({ message: `Programs fetched.`, data: programs });
      } catch (error) {
        return res
          .status(500)
          // @ts-ignore
          .json({ message: error.message });
      }

    default:
      return res
        .status(405)
        .json({ message: `Method ${req.method} not allowed.` });
  }
};

export default handler;
