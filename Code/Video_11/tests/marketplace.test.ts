import { BlockfrostProvider, MeshWallet } from '@meshsdk/core'
import { beforeEach, describe, expect, test } from 'vitest'
import 'dotenv/config'
import { MarketplaceContract } from '../script';
describe("marketplace", function () {
    let sellerWallet: MeshWallet;
    let buyerWallet: MeshWallet;
    let provider: BlockfrostProvider;

    beforeEach(function () {
        provider = new BlockfrostProvider(process.env.BLOCKFROST_PROJECT_ID || "")

        sellerWallet = new MeshWallet({
            networkId: 0, // 0: testnet, 1: mainnet
            fetcher: provider,
            submitter: provider,
            key: {
                type: 'mnemonic',
                words: process.env.WALLET1?.split(" ") || [],
            },
        });

        buyerWallet = new MeshWallet({
            networkId: 0, // 0: testnet, 1: mainnet
            fetcher: provider,
            submitter: provider,
            key: {
                type: 'mnemonic',
                words: process.env.WALLET2?.split(" ") || [],
            },
        });

    })

    test('sell', async () => {
        // return;
        const contract = new MarketplaceContract({
            wallet: sellerWallet,
            fetcher: provider,
            blockfrostProvider: provider
        })

        const unsignedTx = await contract.sell({
            unit: "168a6d5b61956eed530d84156aa822dfd56f1686a52f0b2f5eb256f4" + "686d723030363338",
            priceInLovelace: 100_000_000
        })

        const signedTx = await sellerWallet.signTx(unsignedTx)
        const txHash = await provider.submitTx(signedTx)
        console.log("https://preprod.cexplorer.io/tx/" + txHash)
        provider.onTxConfirmed(txHash, () => {
            expect(txHash.length).toBe(64)
        })
    })

    test('buy', async () => {
        return;
        const contract = new MarketplaceContract({
            wallet: buyerWallet,
            fetcher: provider,
            blockfrostProvider: provider
        })

        const unsignedTx = await contract.buy({
            unit: "3c36604ee0063225147198338de8a4f90c32b00936f465ad86252cab" + "6e6674343533",
        })

        const signedTx = await buyerWallet.signTx(unsignedTx)
        const txHash = await provider.submitTx(signedTx)
        console.log("https://preprod.cexplorer.io/tx/" + txHash)
        provider.onTxConfirmed(txHash, () => {
            expect(txHash.length).toBe(64)
        })
    })

    test('withdraw', async () => {
        return;
        const contract = new MarketplaceContract({
            wallet: sellerWallet,
            fetcher: provider,
            blockfrostProvider: provider
        })

        const unsignedTx = await contract.withdraw({
            unit: "3c36604ee0063225147198338de8a4f90c32b00936f465ad86252cab" + "6e6674343533",
        })

        const signedTx = await sellerWallet.signTx(unsignedTx)
        const txHash = await provider.submitTx(signedTx)
        console.log("https://preprod.cexplorer.io/tx/" + txHash)
        provider.onTxConfirmed(txHash, () => {
            expect(txHash.length).toBe(64)
        })
    })

    test('update', async () => {
        return;
        const contract = new MarketplaceContract({
            wallet: sellerWallet,
            fetcher: provider,
            blockfrostProvider: provider
        })

        const unsignedTx = await contract.update({
            unit: "3c36604ee0063225147198338de8a4f90c32b00936f465ad86252cab" + "6e6674343533",
            newPriceInLovelace: 500_000_000
        })

        const signedTx = await sellerWallet.signTx(unsignedTx)
        const txHash = await provider.submitTx(signedTx)
        console.log("https://preprod.cexplorer.io/tx/" + txHash)
        provider.onTxConfirmed(txHash, () => {
            expect(txHash.length).toBe(64)
        })
    })
})
