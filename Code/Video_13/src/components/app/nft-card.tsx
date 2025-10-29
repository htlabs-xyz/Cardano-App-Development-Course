/* eslint-disable @next/next/no-img-element */
import React from "react";
import useSWR from "swr";
import { get } from "@/lib/axios";
import Link from "next/link";
import TxButton from "./tx-button";

type Props = {
  unit: string;
};

export default function NftCard({ unit }: Props) {
  const { data: result, error, isLoading } = useSWR(`/asset?unit=${unit}`, get);

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  const { metadata, ...datum } = result.data;

  const img = metadata.image.replace("ipfs://", "https://ipfs.blockfrost.dev/ipfs/");
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-4">
        <Link href={`/nft/${unit}`}>
          <div className="relative">
            <img src={img} alt={metadata.name} className="w-full h-64 object-cover" />
          </div>

          {/* NFT Details */}

          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{metadata.fingerprint}</h3>
          </div>
        </Link>

        <div className="flex justify-between items-center">
          {datum.price ? (
            <div>
              <p className="text-2xl font-bold text-purple-600">{datum.price / 1_000_000} ADA</p>
            </div>
          ) : (
            <TxButton action="sell" unit={unit} className="w-full" />
          )}
        </div>
      </div>
    </div>
  );
}
