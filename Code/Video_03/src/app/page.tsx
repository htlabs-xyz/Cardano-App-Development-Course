"use client";
import { useState } from "react";
import { CardanoWallet } from "./components/wallet-connect";
import { useWallet } from "./components/wallet-connect/use-wallet";
import { UTxO } from "@meshsdk/core";

export default function Home() {
  const { browserWallet: wallet } = useWallet();
  const [utxos, setUtxos] = useState<UTxO[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function getUtxos() {
    if (wallet) {
      setLoading(true);
      try {
        const utxos = await wallet.getUtxos();
        setUtxos(utxos);
      } catch (error) {
        console.error("Error fetching UTXOs:", error);
      }
      setLoading(false);
    }
  }

  return (
    <div>

      <h1>Connect Wallet</h1>
      <CardanoWallet />

      <>
        <h1>Get Wallet Assets</h1>
        {utxos ? (
          <pre>
            <code className="language-js">
              {JSON.stringify(utxos, null, 2)}
            </code>
          </pre>
        ) : (
          <button
            type="button"
            onClick={() => getUtxos()}
            disabled={loading || !wallet}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Get Wallet Utxos
          </button>
        )}
      </>

    </div>
  );
};

