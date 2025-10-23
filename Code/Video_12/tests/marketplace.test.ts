import { BlockfrostProvider, MeshWallet } from "@meshsdk/core";
import { beforeEach, describe, expect, test } from "bun:test"
import { MarketplaceContract } from "../script";
describe("marketplace", function () {
    let sellerWallet: MeshWallet;
    let buyerWallet: MeshWallet;
    let provider: BlockfrostProvider;



    beforeEach(function () {
        provider = new BlockfrostProvider(process.env.BLOCKFROST_PROJECT_ID || "")

        sellerWallet = new MeshWallet({
            networkId: 0,
            fetcher: provider,
            submitter: provider,
            key: {
                type: 'mnemonic',
                words: process.env.WALLET1?.split(" ") || [],
            },
        });

        buyerWallet = new MeshWallet({
            networkId: 0,
            fetcher: provider,
            submitter: provider,
            key: {
                type: 'mnemonic',
                words: process.env.WALLET2?.split(" ") || [],
            },
        });
    })



    test("sell", async function () {
        return;
        const contract: MarketplaceContract = new MarketplaceContract(
            {
                wallet: sellerWallet,
                fetcher: provider,
                blockfrostProvider: provider
            }
        )
        const unsignedTx = await contract.sell({
            unit: "bed0a7786cc7c01ff4898c5bf68dfa95d71dd2642fe525b4e818f4c3" + "6563683030323533",
            priceInLovelace: 100_000_000
        })
        const signedTx = await sellerWallet.signTx(unsignedTx)
        const txHash = await provider.submitTx(signedTx)
        console.log("https://preprod.cexplorer.io/tx/" + txHash)
        provider.onTxConfirmed(txHash, () => {
            expect(txHash.length).toBe(64)
        })
    })

    test("buy", async function () {
        return;
        const contract: MarketplaceContract = new MarketplaceContract(
            {
                wallet: buyerWallet,
                fetcher: provider,
                blockfrostProvider: provider
            }
        )

        const unsignedTx = await contract.buy({
            unit: "bed0a7786cc7c01ff4898c5bf68dfa95d71dd2642fe525b4e818f4c3" + "6563683030323533",
        })
        const signedTx = await buyerWallet.signTx(unsignedTx)
        const txHash = await provider.submitTx(signedTx)
        console.log("https://preprod.cexplorer.io/tx/" + txHash)
        provider.onTxConfirmed(txHash, () => {
            expect(txHash.length).toBe(64)
        })
    })

    test("delist", async function () {
        return;
        const contract: MarketplaceContract = new MarketplaceContract(
            {
                wallet: sellerWallet,
                fetcher: provider,
                blockfrostProvider: provider
            }
        )
        const unsignedTx = await contract.withdraw({
            unit: "bed0a7786cc7c01ff4898c5bf68dfa95d71dd2642fe525b4e818f4c3" + "6563683030323533",
        })
        const signedTx = await sellerWallet.signTx(unsignedTx)
        const txHash = await provider.submitTx(signedTx)
        console.log("https://preprod.cexplorer.io/tx/" + txHash)
        provider.onTxConfirmed(txHash, () => {
            expect(txHash.length).toBe(64)
        })
    })

    test("update", async function () {
        const contract: MarketplaceContract = new MarketplaceContract(
            {
                wallet: sellerWallet,
                fetcher: provider,
                blockfrostProvider: provider
            }
        )
        const unsignedTx = await contract.update({
            unit: "bed0a7786cc7c01ff4898c5bf68dfa95d71dd2642fe525b4e818f4c3" + "6563683030323533",
            newPriceInLovelace: 500_000_000
        })
        const signedTx = await sellerWallet.signTx(unsignedTx)
        const txHash = await provider.submitTx(signedTx)
        console.log("https://preprod.cexplorer.io/tx/" + txHash)
        provider.onTxConfirmed(txHash, () => {
            expect(txHash.length).toBe(64)
        })
    })

}
)