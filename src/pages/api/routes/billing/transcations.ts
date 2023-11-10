import type { NextApiRequest, NextApiResponse } from 'next';
import https from 'https';

import { getServerSession } from "next-auth";
import { authOptions } from 'auth/auth';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
        res.status(401).json({ message: `Unauthorized.` });
        return;
    }

    const customerId = session.user.customerId;

    if (!customerId) {
        res.status(400).json({ message: `Failed. You do not have subscriptions` });
        return;
    }


    const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: `/transaction?customer=${customerId}`,
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

        resp.on('end', () => {
            const responseData = JSON.parse(data);

            if (responseData.status) {
                const transactionData = responseData.data;

                // fields to return id: string; amount: number; currency: string; paid_at: string; status: string;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const formattedTransactionData = transactionData.map((transaction: any) => {
                    return {
                        id: transaction.id,
                        amount: transaction.amount,
                        currency: transaction.currency,
                        paid_at: transaction.paid_at,
                        status: transaction.status
                    };
                });

                res.status(200).json({ message: 'Customer transcations fetched', data: formattedTransactionData.filter((x: typeof formattedTransactionData[0]) => x.paid_at) });
            } else {
                res.status(400).json({ message: 'Could not get customer transcations' });
            }
        });
    });

    paystackReq.on('error', (error) => {
        res.status(500).json({ message: error.message });
    });

    paystackReq.end();
};

export default handler;
