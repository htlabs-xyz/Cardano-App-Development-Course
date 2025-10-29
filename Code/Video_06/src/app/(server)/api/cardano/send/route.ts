/* eslint-disable @typescript-eslint/no-explicit-any */
import { MeshTxBuilder } from "@meshsdk/core";
import axios from "axios";

export async function POST(request: Request) {
    try {
        const { sender, receiver, amount } = await request.json()

        if (!sender || !receiver || !amount) {
            throw new Error("Missing required fields: sender, receiver, amount");
        }
        const { data } = await axios.request({
            method: 'GET',
            url: `https://cardano-preprod.blockfrost.io/api/v0/addresses/${sender}/utxos`,
            headers: { Project_id: '' }
        });

        if (!data || data.length === 0) {
            throw new Error("No UTXOs found for the sender address");
        }

        const txBuilder = new MeshTxBuilder({
            verbose: true,
        });

        const utxos = data.map((utxo: any) => {
            return {
                input: {
                    txHash: utxo.tx_hash,
                    outputIndex: utxo.output_index,
                },
                output: {
                    address: utxo.address,
                    amount: utxo.amount
                },
            }
        });

        const unsignedTx = await txBuilder
            .txOut(receiver, [{ unit: "lovelace", quantity: (Number(amount) * 1_000_000).toString() }])
            .changeAddress(sender)
            .selectUtxosFrom(utxos)
            .complete();

        return Response.json({ unsignedTx })
    }
    catch (error) {
        console.error("Transaction creation failed:", error);
        return Response.json({ error: 'Transaction creation failed' }, { status: 500 });
    }
}