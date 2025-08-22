import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request, { params }: { params: Promise<{ address: string }> }) {
    const { address } = await params
    const options = {
        method: 'GET',
        url: `https://cardano-preprod.blockfrost.io/api/v0/addresses/${address}/transactions`,
        headers: { Project_id: 'preprodGwvUMktzqGCwMDuwurFLWSvHG5lD8h6u' }
    };

    try {
        const { data } = await axios.request(options);
        return NextResponse.json(data);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}