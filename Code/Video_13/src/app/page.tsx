"use client";

import useSWR from "swr";
import { get } from "@/lib/axios";
import { Datum } from "@/types";
import NftCard from "@/components/app/nft-card";

export default function Home() {
  const { data: result, error, isLoading } = useSWR("/listed", get);

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className=" py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Cardano NFT Marketplace</h1>
            <p className="text-xl md:text-2xl mb-8">Discover, collect, and trade unique digital assets on Cardano</p>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* NFT Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {result.data.map((datum: Datum, index: number) => (
            <NftCard key={index} unit={datum.unit} />
          ))}
        </div>
      </div>
    </div>
  );
}
