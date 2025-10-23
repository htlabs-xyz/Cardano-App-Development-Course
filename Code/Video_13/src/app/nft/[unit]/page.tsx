/* eslint-disable @next/next/no-img-element */
"use client";

import React, { use } from "react";
import { Button } from "@/components/ui/button";
import useSWR from "swr";
import { get } from "@/lib/axios";
import { hexToString, parseAssetUnit } from "@meshsdk/core";
import { useWallet } from "@/hooks/use-wallets";
import TxButton from "@/components/app/tx-button";

export default function NftDetailPage({ params }: { params: Promise<{ unit: string }> }) {
  const { unit } = use(params);
  const { address } = useWallet();
  const { data: result, error, isLoading } = useSWR(`/asset?unit=${unit}`, get);

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  const { metadata, ...datum } = result.data;
  const img = metadata.image.replace("ipfs://", "https://ipfs.blockfrost.dev/ipfs/");
  const { policyId, assetName } = parseAssetUnit(unit);
  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - NFT Image */}
          <div className="space-y-6">
            <div className="relative">
              <img src={img} alt={metadata.name} className="w-full rounded-lg shadow-lg" />
            </div>
          </div>

          {/* Right Column - NFT Details */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold bg-purple-600 text-white`}>{policyId}</span>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{hexToString(assetName)}</h1>
                  {datum.seller && <p className="text-gray-600">Seller: {datum.seller.slice(0, 50) + "..."}</p>}
                </div>
              </div>

              {/* Price and Buy Button */}
              <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                  {datum.price && (
                    <div>
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="text-3xl font-bold text-purple-600">{datum.price / 1_000_000} ADA</p>
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center gap-4">
                  {address == datum.seller && datum.seller ? (
                    <>
                      <TxButton className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg" action={"update"} unit={unit} />
                      <TxButton className="w-1/2 bg-red-600 hover:bg-red-700 text-white py-3 text-lg" action={"withdraw"} unit={unit} />
                    </>
                  ) : address && datum.price ? (
                    <TxButton className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg" action={"buy"} unit={unit} />
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6">
                <div className="grid gap-4">
                  {Object.entries(metadata).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-4 gap-2 border-b border-muted-foreground py-2">
                      <p className="text-sm text-muted-foreground col-span-1">{key}</p>
                      <p className="text-sm font-medium text-end col-span-3 truncate">{value as string}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
