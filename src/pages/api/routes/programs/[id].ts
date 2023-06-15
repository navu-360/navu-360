import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../../auth/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = req.query.id as string;

  if (req.method === "GET") {
    try {
      const program = await prisma.onboardingProgram.findUnique({
        where: {
          id,
        },
      });

      return res
        .status(200)
        .json({ message: `Program fetched.`, data: program });
    } catch (error) {
      return res
        .status(500)
        // @ts-ignore
        .json({ message: error.message });
    }
  }

  if (req.method === "DELETE") {
    try {
      const program = await prisma.onboardingProgram.delete({
        where: {
          id,
        },
      });

      return res
        .status(200)
        .json({ message: `Program deleted.`, data: program });
    } catch (error) {
      return res
        .status(500)
        // @ts-ignore
        .json({ message: error.message });
    }
  }

  if (req.method === "PATCH") {
    try {
      const { name, content } = req.body as {
        name: string;
        content: string;
      };

      const program = await prisma.onboardingProgram.update({
        where: {
          id,
        },
        data: {
          name,
          content,
        },
      });

      return res
        .status(200)
        .json({ message: `Program updated.`, data: program });
    } catch (error) {
      return res
        .status(500)
        // @ts-ignore
        .json({ message: error.message });
    }
  }

  res.status(405).json({ message: `Method ${req.method} not allowed.` });
};

export default handler;
