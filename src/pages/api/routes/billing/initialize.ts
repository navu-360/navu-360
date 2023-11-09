import type { NextApiRequest, NextApiResponse } from 'next';
import https from 'https';

import { getServerSession } from "next-auth";
import { authOptions } from 'auth/auth';
import { getAmountFromPlan, getPlanIdFromName } from 'pages/setup';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    const session = await getServerSession(req, res, authOptions);
    if (!session) {
        res.status(401).json({ message: `Unauthorized.` });
        return;
    }

    const { sub } = req.body;

    const now = new Date().getTime();
    const fourteenDaysLater = now + 14 * 24 * 60 * 60 * 1000;

    const params = JSON.stringify({
        email: session?.user.email as string,
        amount: getAmountFromPlan(sub as string),
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY as string,
        plan: getPlanIdFromName(sub as string),
        firstname: session?.user.name?.split(" ")[0],
        lastname: session?.user.name?.split(" ")[1],
        callback_url: `${process.env.NEXTAUTH_URL}/account?upgraded=true`,
        // start_date: now + 14 days, free trial
        start_date: new Date(fourteenDaysLater).toISOString(),
    })

    const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: '/transaction/initialize',
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + process.env.PAYSTACK_SECRET_KEY,
            'Content-Type': 'application/json'
        }
    }

    const paystackReq = https.request(options, (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            const responseData = JSON.parse(data);

            if (responseData.status) {
                const transactionData = responseData.data;
                res.status(200).json({ message: 'Customer details fetched', data: transactionData });
            } else {
                res.status(404).json({ message: 'Could not get customer details' });
            }
        });
    });

    paystackReq.on('error', (error) => {
        res.status(500).json({ message: error.message });
    });

    paystackReq.write(params)
    paystackReq.end()
};

export default handler;


