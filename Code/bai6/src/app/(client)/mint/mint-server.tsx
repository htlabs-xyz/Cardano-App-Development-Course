"use client"

import { CardanoWallet } from "@/components/wallet-connect";
import { useWallet } from "@/components/wallet-connect/use-wallet";
import axios from "axios";
import type React from "react"

import { useEffect, useState } from "react"

export default function Component() {
    const { browserWallet: wallet, disconnect } = useWallet();
    const [balance, setBalance] = useState(0);
    const [receiver, setReceiver] = useState("");
    const [metadata, setMetadata] = useState({
        name: "nft453",
        description: "Pixel Art NFT",
        image: "ipfs://QmcQMZ9WKCBUYWpyewgzFhr1Kh9bN2sqdDjUF44ztzhrm4",
        locate: "ha noi, vietnam",
    })

    useEffect(() => {
        if (wallet) {
            (async () => {
                try {
                    const balance = Number(await wallet.getLovelace()) / 1_000_000;
                    setBalance(balance);
                } catch (error) {
                    console.error("Failed to fetch balance:", error);
                }
            })();
        }
    }, [wallet]);

    const canMint = metadata.image && metadata.name && metadata.description && metadata.locate && wallet


    const handleMint = async () => {
        if (!wallet) {
            alert("Please connect a wallet first.");
            return;
        }
        if (!canMint) {
            alert("Please fill in all fields.");
            return;
        }
        try {
            const response = await axios.post('/api/cardano/mint', {
                author: await wallet.getChangeAddress(),
                receiver: receiver || await wallet.getChangeAddress(),
                metadata: metadata
            });

            if (response.data.error) {
                throw new Error(response.data.error);
            }

            const signedTx = await wallet.signTx(response.data.unsignedTx);
            const txHash = await wallet.submitTx(signedTx);

            alert(`Transaction successful, hash: ${txHash}`);
        } catch (error) {
            console.error("Transaction failed:", error);
            alert("Transaction failed. Please check the console for details.");
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center space-y-2 mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Mint NFT trên Cardano</h1>
                </div>

                {/* Single Form */}
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
                    <form className="space-y-8">
                        {/* From Wallet */}
                        <div className="space-y-2">
                            {
                                wallet ? (
                                    <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                                        <span className="text-2xl">₳</span>
                                        <div className="flex-1">
                                            <div className="font-medium text-lg">Cardano (ADA)</div>
                                            <div className="text-sm text-gray-600">Số dư: {balance} ADA</div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={disconnect}
                                            className="text-sm text-blue-600 hover:underline"
                                        >
                                            disconnect
                                        </button>
                                    </div>
                                ) : (
                                    <CardanoWallet />
                                )
                            }
                        </div>

                        {/* IPFS Link Section */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Link IPFS</label>
                                <input
                                    type="text"
                                    name="image"
                                    placeholder="VD: ipfs://Qm...xyz"
                                    value={metadata.image}
                                    onChange={(e) => setMetadata({ ...metadata, image: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                />
                            </div>
                            {/* NFT Details Section */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Nhập tên NFT"
                                        value={metadata.name}
                                        onChange={(e) => setMetadata({ ...metadata, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        name="description"
                                        placeholder="Mô tả về NFT của bạn"
                                        value={metadata.description}
                                        onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className=" text-sm font-medium text-gray-700 flex items-center gap-2">
                                        Locate
                                    </label>
                                    <input
                                        type="text"
                                        name="locate"
                                        placeholder="VD: Hà Nội, Việt Nam"
                                        value={metadata.locate}
                                        onChange={(e) => setMetadata({ ...metadata, locate: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className=" text-sm font-medium text-gray-700 flex items-center gap-2">
                                        Receiver
                                    </label>
                                    <input
                                        type="text"
                                        name="receiver"
                                        placeholder="Người nhận, nếu không có sẽ là người tạo"
                                        value={receiver}
                                        onChange={(e) => setReceiver(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <hr className="border-gray-200" />



                        <div className="space-y-4">
                            <button
                                type="button"
                                onClick={handleMint}
                                disabled={!canMint}
                                className="w-full inline-flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Tạo NFT
                            </button>


                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
