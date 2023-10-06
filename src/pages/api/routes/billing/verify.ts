import type { NextApiRequest, NextApiResponse } from 'next';
import https from 'https';

import { prisma } from "../../../../auth/db";

import { getServerSession } from "next-auth";
import { authOptions } from 'auth/auth';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    const session = await getServerSession(req, res, authOptions);
    if (!session) {
        res.status(401).json({ message: `Unauthorized.` });
        return;
    }

    const email = session.user.email;

    const { reference } = req.body;

    const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: `/transaction/verify/${reference}`,
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + process.env.PAYSTACK_SECRET_KEY,
            'Content-Type': 'application/json'
        }
    };

    const paystackReq = https.request(options, (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', async () => {
            const responseData = JSON.parse(data);

            if (responseData.status) {
                const transactionData = responseData.data;

                const { customer } = transactionData;
                const customerId = customer.id;

                await prisma.user.update({
                    where: {
                        email,
                    },
                    data: {
                        customerId: customerId.toString(),
                    },
                });

                res.status(200).json({ message: 'Transaction verified' });
            } else {
                console.log("responseData", responseData)
                res.status(400).json({ message: 'Transaction not verified' });
            }
        });
    });

    paystackReq.on('error', (error) => {
        res.status(500).json({ message: error.message });
    });

    paystackReq.end();
};

export default handler;
