"use client"

import { CardanoWallet } from "@/components/wallet-connect";
import { useWallet } from "@/components/wallet-connect/use-wallet"
import axios from "axios";
import { useEffect, useState } from "react"


export default function Component() {
    const { browserWallet: wallet, disconnect } = useWallet();
    const [recipients, setRecipients] = useState({ address: "", amount: "" })
    const [balance, setBalance] = useState(0);

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


    const createTransaction = async () => {
        if (!wallet) {
            alert("Please connect a wallet first.");
            return;
        }
        if (!recipients.address || !recipients.amount) {
            alert("Please fill in all fields.");
            return;
        }
        try {
            const response = await axios.post('/api/cardano/send', {
                sender: await wallet.getChangeAddress(),
                receiver: recipients.address,
                amount: recipients.amount
            });

            if (response.data.error) {
                throw new Error(response.data.error);
            }

            const signedTx = await wallet.signTx(response.data.unsignedTx);
            const txHash = await wallet.submitTx(signedTx);
            alert(`Transaction successful!, ansaction hash: ${txHash}`);
        } catch (error) {
            console.error("Transaction failed:", error);
            alert("Transaction failed. Please check the console for details.");
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold text-gray-900">Tạo Giao Dịch Cardano (ADA)</h1>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">

                        <div className="p-6 space-y-6">
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
                                                Disconnect
                                            </button>
                                        </div>
                                    ) : (
                                        <CardanoWallet />
                                    )
                                }
                            </div>

                            {/* Recipients */}
                            <div className="space-y-4">

                                <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Địa chỉ nhận</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Nhập địa chỉ ví"
                                                onChange={(e) => setRecipients((prev) => ({ ...prev, address: e.target.value }))}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Số lượng</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                placeholder="0.00"
                                                onChange={(e) => setRecipients((prev) => ({ ...prev, amount: e.target.value }))}
                                                className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">ADA</div>
                                        </div>

                                    </div>
                                </div>

                            </div>


                            {/* Action Button */}
                            <button
                                onClick={createTransaction}
                                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Tạo Giao Dịch
                            </button>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    )
}
