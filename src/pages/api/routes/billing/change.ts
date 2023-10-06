import type { NextApiRequest, NextApiResponse } from 'next';
import https from 'https';

import { getServerSession } from "next-auth";
import { authOptions } from 'auth/auth';

type RequestOptions = https.RequestOptions;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    const session = await getServerSession(req, res, authOptions);
    if (!session) {
        res.status(401).json({ message: `Unauthorized.` });
        return;
    }

    const { planSub } = req.query;

    const customerId = session.user.customerId;



    // fetch user subscription
    const optionsGetSub = {
        hostname: 'api.paystack.co',
        port: 443,
        path: `/subscription?customer=${customerId}`,
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + process.env.PAYSTACK_SECRET_KEY,
            'Content-Type': 'application/json'
        }
    };

    const userSub = await makeRequest(optionsGetSub, undefined);
    if (userSub?.data?.length === 0 || !userSub?.data) {
        res.status(400).json({ message: `Failed. You do not have subscriptions` });
        return;
    }
    const subscription_code = userSub.data[0].subscription_code;
    const email_token = userSub.data[0].email_token;
    // cancel subscription
    const paramsCancel = JSON.stringify({
        "code": subscription_code,
        "token": email_token
    })

    const optionsCancel = {
        hostname: 'api.paystack.co',
        port: 443,
        path: '/subscription/disable',
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + process.env.PAYSTACK_SECRET_KEY,
            'Content-Type': 'application/json'
        }
    }
    const cancelSub = await makeRequest(optionsCancel, paramsCancel);
    console.log(cancelSub);
    if (!cancelSub.status) {
        res.status(400).json({ message: `Failed. Could not cancel subscription` });
        return;
    }
    // create new subscription
    const paramsCreate = JSON.stringify({
        "code": planSub,
        "token": email_token
    })


    const optionsCreate = {
        hostname: 'api.paystack.co',
        port: 443,
        path: '/subscription/enable',
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + process.env.PAYSTACK_SECRET_KEY,
            'Content-Type': 'application/json'
        }
    }

    const createSub = await makeRequest(optionsCreate, paramsCreate);
    console.log(createSub);
    if (!createSub) {
        res.status(400).json({ message: `Failed. Could not create subscription` });
        return;
    }


    return res.status(200).json({ message: 'Success' });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const makeRequest = async (options: RequestOptions, params: string | undefined): Promise<any> => {
    return new Promise((resolve, reject) => {
        const req = https.request(options, res => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                resolve(JSON.parse(data));
            });
        }).on('error', error => {
            reject(error);
        });

        params && req.write(params);
        req.end();
    });
};

export default handler;
