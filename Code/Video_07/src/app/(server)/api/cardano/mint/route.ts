/* eslint-disable @typescript-eslint/no-explicit-any */
import { ForgeScript, MeshTxBuilder, resolveScriptHash, stringToHex } from "@meshsdk/core";
import axios from "axios";

export async function POST(request: Request) {
    try {
        const { author, receiver, metadata } = await request.json()

        if (!author || !receiver || !metadata || !metadata.name || !metadata.description) {
            throw new Error("Missing required fields: author, receiver, metadata.name, or metadata.description");
        }
        const { data } = await axios.request({
            method: 'GET',
            url: `https://cardano-preprod.blockfrost.io/api/v0/addresses/${author}/utxos`,
            headers: { Project_id: '' }
        });

        if (!data || data.length === 0) {
            throw new Error("No UTXOs found for the author address");
        }


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

        const forgingScript = ForgeScript.withOneSignature("addr_test1qp4ppf2zpcjml4h2sht3u85r3435lr83mj6s2r6jxvnp9dduragctladk6su7yem9nayv9w66ul4e83s0ghdkya4q7xqxndmg6");

        const policyId = resolveScriptHash(forgingScript);
        const tokenName = metadata.name.replace(/\s+/g, "_").toLowerCase();
        const tokenNameHex = stringToHex(tokenName);
        const assetMetadata = { [policyId]: { [tokenName]: { ...metadata } } };
        const txBuilder = new MeshTxBuilder({
            verbose: true,
        });

        const unsignedTx = await txBuilder
            .mint("1", policyId, tokenNameHex)
            .mintingScript(forgingScript)
            .metadataValue(721, assetMetadata)
            .txOut(
                receiver || author,
                [
                    { unit: policyId + tokenNameHex, quantity: "1" }
                ]
            )
            .changeAddress(author)
            .selectUtxosFrom(utxos)
            .complete();
        return Response.json({ unsignedTx })
    }
    catch (error) {
        console.error("Transaction creation failed:", error);
        return Response.json({ error: 'Transaction creation failed' }, { status: 500 });
    }
}