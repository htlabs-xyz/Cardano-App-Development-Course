/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CardanoWallet } from "@/components/wallet-connect";
import { useWallet } from "@/components/wallet-connect/use-wallet";
import { MeshTxBuilder } from "@meshsdk/core";




export default function Home() {
  const [tasks, setTasks] = useState<any>([]);
  const { browserWallet: wallet } = useWallet();

  useEffect(() => {
    fetchTasks().then(data => {
      setTasks(data);
    });
  }, []);

  const sendAda = async () => {
    if (!wallet) {
      alert("Please connect your wallet first.");
      return;
    }
    const utxos = await wallet.getUtxos();
    const changeAddress = await wallet.getChangeAddress();

    const txBuilder = new MeshTxBuilder({
      verbose: true,
    })
    const unsignedTx = await txBuilder
      .txOut('addr_test1vpvx0sacufuypa2k4sngk7q40zc5c4npl337uusdh64kv0c7e4cxr', [{ unit: "lovelace", quantity: '1000000' }])
      .changeAddress(changeAddress)
      .selectUtxosFrom(utxos)
      .complete();

    const signedTx = await wallet.signTx(unsignedTx);
    const txHash = await wallet.submitTx(signedTx);
    alert(`Transaction submitted with hash: ${txHash}`);
  }



  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Task List (Client-Side)</h1>

      <CardanoWallet />

      <button onClick={sendAda} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
        Send ADA
      </button>
      <ul className="space-y-4">
        {tasks.map((task: any) => (
          <li key={task.id} className="border p-4 rounded">
            <h2 className="text-xl font-semibold">{task.title}</h2>
            <div className="mt-2 space-x-2">
              <Link href={`/view/${task.id}`} className=" bg-green-800 text-white px-4 py-2 rounded ">
                View
              </Link>

            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}


async function fetchTasks() {
  const res = await fetch('/api/tasks');
  const data = await res.json();
  return data;
}