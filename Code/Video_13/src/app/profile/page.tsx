/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useSWR from "swr";
import { get } from "@/lib/axios";
import { useWallet } from "@/hooks/use-wallets";
import NftCard from "@/components/app/nft-card";

export default function ProfilePage() {
  const { address } = useWallet();

  const { data: result, error, isLoading } = useSWR(`/profile?address=${address}`, get);

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;
  if (!address) return <div>connect wallet to view</div>;

  const { ownAssets, listingAssets } = result;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">U</span>
            </div>
            <div>
              <p className="text-gray-600">{address}</p>
              <div className="flex space-x-6 mt-2">
                <div>
                  <p className="text-sm text-gray-500">Wallet NFTs</p>
                  <p className="text-lg font-semibold">{ownAssets.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Listed NFTs</p>
                  <p className="text-lg font-semibold">{listingAssets.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="wallet" className="w-full">
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="px-6 pt-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="wallet" className="flex items-center space-x-2">
                  <span>My NFTs in Wallet</span>
                </TabsTrigger>
                <TabsTrigger value="listed" className="flex items-center space-x-2">
                  <span>Listed NFTs in Marketplace</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="wallet">
                {/* Wallet NFTs Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {ownAssets.map(({ unit }: { unit: string }) => (
                    <NftCard key={unit} unit={unit} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="listed">
                {/* Listed NFTs Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {listingAssets.map(({ unit }: { unit: string }) => (
                    <NftCard key={unit} unit={unit} />
                  ))}
                </div>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
