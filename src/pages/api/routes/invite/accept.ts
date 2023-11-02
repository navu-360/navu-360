/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";

import { readFileSync } from "fs";
import { join } from "path";
import sgMail from "@sendgrid/mail";
import { env } from "env/server.mjs";

sgMail.setApiKey(env.SENDGRID_API_KEY);

import https from 'https';

import { getServerSession } from "next-auth";

import { prisma } from "auth/db";
import { authOptions } from "auth/auth";
import { getMaxTalentCountFromAmount } from "pages/setup";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    /*
      API endpoint to 1) accept an invite
      */

    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        res.status(401).json({ message: `Unauthorized.` });
        return;
    }

    switch (req.method) {
        case "POST":
            try {
                const {
                    inviteId
                } = req.body as {
                    inviteId: string;
                };

                // get invite by inviteId
                const invite = await prisma.invites.findUnique({
                    where: {
                        id: inviteId,
                    },
                });

                if (!invite) {
                    res.status(404).json({ message: `Invite not found. Please double check your invite link` });
                    return;
                }

                // we check if the inviting org are withing their allowed seats limit
                // we first get the total talents at the moment: call endpoint /api/billing/usage
                // get org for current user
                const organization = await prisma.organization.findFirst({
                    where: {
                        id: invite.orgId as string,
                    },
                    select: {
                        id: true,
                        user: true,
                        name: true,
                    }
                });
                if (!organization) {
                    res.status(400).json({ message: `Organization not found.` });
                    return;
                }
                // get a count of users who talentOrgId is equal to the current user's org id
                const allTalents = await prisma.user.findMany({
                    where: {
                        talentOrgId: organization.id,
                        hasBeenOnboarded: true
                    },
                    select: {
                        id: true,
                    }
                });
                // we get the users current plan amount: call endpoint /api/billing/plan
                const email = organization.user.email;

                const options = {
                    hostname: 'api.paystack.co',
                    port: 443,
                    path: `/customer/${email}`,
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + process.env.PAYSTACK_SECRET_KEY,
                        'Content-Type': 'application/json'
                    }
                };

                let currentPlanAmount = 0;

                const paystackReq = https.request(options, (resp) => {
                    let data = '';

                    resp.on('data', (chunk) => {
                        data += chunk;
                    });

                    resp.on('end', () => {
                        const responseData = JSON.parse(data);

                        if (responseData.status) {
                            const transactionData = responseData.data;

                            currentPlanAmount = transactionData?.subscriptions[transactionData?.subscriptions?.length - 1]?.amount ?? -1
                        } else {
                            throw new Error('We could not process your invite at the moment. Please try again later');
                        }
                    });
                });
                paystackReq.on('error', (error: any) => {
                    res.status(500).json({ message: error.message });
                });

                paystackReq.end();
                // we call method getMaxTalentCountFromAmount with the plan amount to get current plan max talent count
                const maxAllowed = getMaxTalentCountFromAmount(currentPlanAmount);

                if (allTalents.length >= maxAllowed) {
                    await prisma.user.delete({
                        where: {
                            email: session.user.email,
                        },
                    }).catch((error) => {
                        console.log("error deleting user", error);
                    });

                    const path = join(process.cwd(), "src/utils/emails/failedAccept.html");
                    const stringTemplate = readFileSync(path, "utf8");

                    const link = `${env.NEXTAUTH_URL}`;

                    const msg = {
                        to: organization?.user?.email,
                        from: {
                            email: env.EMAIL_FROM,
                            name: `Navu360`,
                        },
                        replyTo: env.REPLY_TO,
                        subject: `Could not add new talent to ${organization?.name} - Upgrade your plan`,
                        // email template path src/utils/emails/inviteTalent.html
                        html: stringTemplate
                            .replace(/{{talentName}}/g, session?.user?.name)
                            .replace(/{{adminName}}/g, organization?.user?.name as string)
                            .replace(/{{link}}/g, link)
                            .replace(/{{todayYear}}/g, new Date().getFullYear().toString()),
                    };

                    // @ts-ignore
                    await sgMail.send(msg);

                    res.status(400).json({ message: `We could not add you to ${organization?.name}. Your organization admin has been notified` });
                    return;
                }

                // compare session user email with invite email
                if (invite?.email !== session.user.email) {
                    // delete user
                    await prisma.user.delete({
                        where: {
                            email: session.user.email,
                        },
                    }).catch((error) => {
                        console.log("error deleting user", error);
                    });

                    res.status(401).json({ message: `Unauthorized. Please use the email you received the invite on` });
                    return;
                }


                // check if expired - 24hrs since invite was created
                const now = new Date();
                const createdAt = new Date(invite.createdAt);
                const diff = now.getTime() - createdAt.getTime();
                const diffInHours = diff / (1000 * 3600);
                if (diffInHours > 24) {
                    res.status(400).json({ message: `Invite has expired.` });
                    return;
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: session.user.email,
                    },
                });

                if (user?.talentOrgId && user?.hasBeenOnboarded) {
                    res
                        .status(400)
                        .json({
                            message: `${user.name} has already been invited`,
                        });
                    return;
                }

                const userToEdit = await prisma.user.update({
                    where: {
                        email: session.user.email,
                    },
                    data: {
                        position: "",
                        role: "talent",
                        hasBeenOnboarded: true,
                        talentOrgId: invite.orgId,
                    },
                });

                return res
                    .status(200)
                    .json({
                        message: `User ${userToEdit.name} updated.`,
                        data: userToEdit,
                    });
            } catch (error) {
                return res
                    .status(500)
                    // @ts-ignore
                    .json({ message: error.message });
            }

        default:
            res.status(405).json({ message: `Method ${req.method} not allowed.` });
    }
};

export default handler;
