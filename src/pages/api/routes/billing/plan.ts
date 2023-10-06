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

    const email = session.user.email;

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

    const paystackReq = https.request(options, (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            const responseData = JSON.parse(data);

            if (responseData.status) {
                const transactionData = responseData.data;

                res.status(200).json({ message: 'Customer details fetched', data: transactionData?.subscriptions[transactionData?.subscriptions?.length - 1]?.amount ?? -1 });
            } else {
                console.log(responseData);
                res.status(404).json({ message: 'Could not get customer details' });
            }
        });
    });

    paystackReq.on('error', (error) => {
        res.status(500).json({ message: error.message });
    });

    paystackReq.end();
};

export default handler;
