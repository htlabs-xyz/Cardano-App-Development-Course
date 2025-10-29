import React, { useState } from "react";
import { Button } from "../ui/button";
import { TransactionAction } from "@/types";
import { cn } from "@/utils";
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { useWallet } from "@/hooks/use-wallets";
import { post } from "@/lib/axios";
import Link from "next/link";

type TxButtonProps = {
  action: TransactionAction;
  unit: string;
  className?: string;
};

const actionConfig = {
  sell: {
    label: "Sell",
    dialogTitle: "Price",
    successAction: "Send Listing",
    requiresPrice: true,
    enpoint: "/tx/sell",
  },
  buy: {
    label: "Buy",
    dialogTitle: "",
    successAction: "Buy",
    requiresPrice: false,
    enpoint: "/tx/buy",
  },
  update: {
    label: "Update",
    dialogTitle: "New Price",
    successAction: "Update",
    requiresPrice: true,
    enpoint: "/tx/update",
  },
  withdraw: {
    label: "Delist",
    dialogTitle: "",
    successAction: "Delist",
    requiresPrice: false,
    enpoint: "/tx/withdraw",
  },
};

export default function TxButton({ className, unit, action }: TxButtonProps) {
  const { address, browserWallet } = useWallet();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [txhash, setTxhash] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState("");

  const config = actionConfig[action];

  const createTx = async () => {
    try {
      setLoading(true);
      setError("");

      if (!unit) {
        throw new Error("Asset not found");
      }

      if (!address || !browserWallet) {
        throw new Error("Wallet not connected");
      }

      let priceInLovelace: number | undefined;

      if (config.requiresPrice) {
        priceInLovelace = parseInt(price) * 1_000_000;
        if (isNaN(priceInLovelace) || priceInLovelace <= 1_000_000) {
          throw new Error("Price must be a number and greater than 1 ADA");
        }
      }

      const response = await post(config.enpoint, {
        address: address,
        unit: unit,
        ...(priceInLovelace && {
          price: priceInLovelace,
        }),
      });

      const { result, data, message } = response;
      if (!result) {
        throw new Error(message);
      }
      const signedTx = await browserWallet.signTx(data);
      const txhash = await browserWallet.submitTx(signedTx);
      setTxhash(txhash);

      // submit txhash to backend
    } catch (e) {
      setError(e instanceof Error ? e.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (config.requiresPrice) {
    return (
      <>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className={cn(className)}>{config.label}</Button>
          </DialogTrigger>
          <DialogContent className="max-w-[425px]">
            {txhash === "" ? (
              <>
                <div className="p-4 space-y-6">
                  <div>
                    <label htmlFor="price" className="block text-lg font-medium mb-2">
                      {config.dialogTitle}
                    </label>
                    <div className="relative">
                      <Input
                        id="price"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className=" border-gray-700 pr-16 h-14 text-lg"
                        placeholder="0"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 pointer-events-none">ADA</div>
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                  </div>
                </div>

                <DialogFooter>
                  <Button onClick={createTx}>{loading ? "Create Transaction ..." : config.successAction}</Button>
                </DialogFooter>
              </>
            ) : (
              <div className="h-full py-8 px-10 m-auto flex flex-col">
                <div className="flex flex-col items-center justify-center">
                  <p className="mb-2 text-center text-lg font-semibold">successful! 🎉</p>
                  <p className="mb-4 max-w-md text-center text-sm text">Please wait a moment for the transaction to complete.</p>
                  <div className="flex flex-row items-center justify-center space-x-4">
                    <Link
                      href={`https://${process.env.NEXT_PUBLIC_APP_NETWORK}.cexplorer.io/tx/${txhash}`}
                      target="_blank"
                      className="mt-4 rounded-lg px-6 py-2 bg-gray-900 text-sm font-semibold text-blue-200"
                    >
                      View on Cexplorer
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <Button onClick={createTx} className={cn(className)} disabled={loading}>
        {loading ? "Create Transaction ..." : config.label}
      </Button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Dialog
        open={txhash !== ""}
        onOpenChange={(open) => {
          if (!open) {
            setTxhash("");
          }
        }}
      >
        <DialogContent className="max-w-[425px]">
          <div className="h-full py-8 px-10 m-auto flex flex-col">
            <div className="flex flex-col items-center justify-center">
              <p className="mb-2 text-center text-lg font-semibold">successful! 🎉</p>
              <p className="mb-4 max-w-md text-center text-sm text">Please wait a moment for the transaction to complete.</p>
              <div className="flex flex-row items-center justify-center space-x-4">
                <Link
                  href={`https://${process.env.NEXT_PUBLIC_APP_NETWORK}.cexplorer.io/tx/${txhash}`}
                  target="_blank"
                  className="mt-4 rounded-lg px-6 py-2 bg-gray-900 text-sm font-semibold text-blue-200 shadow-md"
                >
                  View on Cexplorer
                </Link>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
