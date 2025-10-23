/* eslint-disable @next/next/no-img-element */
"use client";

import React, { use, useState } from "react";
import { Button } from "@/components/ui/button";
import { CardanoWallet } from "@/components/common/cardano-wallet";
import Link from "next/link";

// Placeholder NFT data - in real app, this would come from API based on unit
const getNFTData = (unit: string) => {
  const nftData = {
    "cardano-genesis-001": {
      id: 1,
      unit: "cardano-genesis-001",
      name: "Cardano Genesis #001",
      description:
        "A rare genesis NFT from the Cardano ecosystem. This unique digital asset represents the beginning of a new era in blockchain technology, featuring intricate designs inspired by the Cardano blockchain's innovative approach to sustainability and scalability.",
      image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop",
      price: 150,
      currency: "ADA",
      creator: "CardanoArt",
      creatorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      collection: "Genesis Collection",
      collectionImage: "https://images.unsplash.com/photo-1634017839464-19910a7ec0f2?w=200&h=200&fit=crop",
      rarity: "Legendary",
      likes: 1247,
      views: 8932,
      isLiked: false,
      owner: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
      tokenId: "001",
      contractAddress: "0x1234567890abcdef1234567890abcdef12345678",
      blockchain: "Cardano",
      createdAt: "2024-01-15",
      properties: [
        { trait_type: "Background", value: "Cosmic Purple" },
        { trait_type: "Eyes", value: "Laser Blue" },
        { trait_type: "Mouth", value: "Digital Smile" },
        { trait_type: "Accessories", value: "Holographic Crown" },
        { trait_type: "Rarity", value: "Legendary" },
        { trait_type: "Generation", value: "Genesis" },
      ],
      history: [
        {
          event: "Minted",
          price: "0 ADA",
          from: "Null",
          to: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
          date: "2024-01-15",
          txHash: "0xabc123...",
        },
        {
          event: "Listed",
          price: "150 ADA",
          from: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
          to: "Marketplace",
          date: "2024-01-20",
          txHash: "0xdef456...",
        },
      ],
      similarNFTs: [
        {
          id: 2,
          name: "Cardano Genesis #002",
          image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop",
          price: 89,
          currency: "ADA",
        },
        {
          id: 3,
          name: "Cardano Genesis #003",
          image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=200&h=200&fit=crop",
          price: 120,
          currency: "ADA",
        },
        {
          id: 4,
          name: "Cardano Genesis #004",
          image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=200&h=200&fit=crop",
          price: 200,
          currency: "ADA",
        },
      ],
    },
  };

  return nftData[unit as keyof typeof nftData] || nftData["cardano-genesis-001"];
};

export default function NftDetailPage({ params }: { params: Promise<{ unit: string }> }) {
  const { unit } = use(params);
  const nft = getNFTData(unit);

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - NFT Image */}
          <div className="space-y-6">
            <div className="relative">
              <img src={nft.image} alt={nft.name} className="w-full rounded-lg shadow-lg" />
            </div>
          </div>

          {/* Right Column - NFT Details */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold bg-purple-600 text-white`}>
                    5a7fafefd25882bdc91441f52a688e85bdb66482968defcc5a109062
                  </span>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{nft.name}</h1>
                  <p className="text-gray-600">Seller: addr_test1qpc80lcd66vj9xe...gr8tg7cm4xuz9arxcnqux0hml</p>
                </div>
              </div>

              {/* Price and Buy Button */}
              <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="text-3xl font-bold text-purple-600">
                      {nft.price} {nft.currency}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center gap-4">
                  <Button className="w-1/2 bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg">Buy Now</Button>
                  <Button className="w-1/2 bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg">Buy Now</Button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6">
                <div className="grid gap-4">
                  {nft.properties.map((property, index) => (
                    <div key={index} className="grid grid-cols-4 gap-2 border-b border-muted-foreground py-2">
                      <p className="text-sm text-muted-foreground col-span-1">{property.trait_type}</p>
                      <p className="text-sm font-medium text-end col-span-3">{property.value}</p>
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
