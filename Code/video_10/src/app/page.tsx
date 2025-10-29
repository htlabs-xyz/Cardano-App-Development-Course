/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardanoWallet } from "@/components/common/cardano-wallet";

// Placeholder NFT data
const placeholderNFTs = [
  {
    id: 1,
    name: "Cardano Genesis #001",
    description: "A rare genesis NFT from the Cardano ecosystem",
    image: "https://images.unsplash.com/photo-1634017839464-19910a7ec0f2?w=400&h=400&fit=crop",
    price: 150,
    currency: "ADA",
    creator: "CardanoArt",
    collection: "Genesis Collection",
    rarity: "Legendary",
    likes: 1247,
    views: 8932,
    isLiked: false,
  },
  {
    id: 2,
    name: "Digital Dreams #042",
    description: "Abstract digital art representing the future of blockchain",
    image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop",
    price: 89,
    currency: "ADA",
    creator: "DigitalArtist",
    collection: "Abstract Visions",
    rarity: "Epic",
    likes: 892,
    views: 4567,
    isLiked: true,
  },
  {
    id: 3,
    name: "Crypto Cat #1337",
    description: "A cute cat NFT with cyberpunk aesthetics",
    image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop",
    price: 45,
    currency: "ADA",
    creator: "CryptoCats",
    collection: "Feline Friends",
    rarity: "Rare",
    likes: 2156,
    views: 12034,
    isLiked: false,
  },
  {
    id: 4,
    name: "Space Explorer #999",
    description: "An astronaut exploring the digital cosmos",
    image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=400&fit=crop",
    price: 200,
    currency: "ADA",
    creator: "SpaceArt",
    collection: "Cosmic Collection",
    rarity: "Legendary",
    likes: 3421,
    views: 15678,
    isLiked: true,
  },
  {
    id: 5,
    name: "Neon City #777",
    description: "Cyberpunk cityscape with neon lights",
    image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400&h=400&fit=crop",
    price: 75,
    currency: "ADA",
    creator: "NeonArtist",
    collection: "Cyberpunk Dreams",
    rarity: "Epic",
    likes: 1789,
    views: 7890,
    isLiked: false,
  },
  {
    id: 6,
    name: "Nature's Code #256",
    description: "Fractal patterns found in nature, digitized",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
    price: 60,
    currency: "ADA",
    creator: "NatureCoder",
    collection: "Digital Nature",
    rarity: "Rare",
    likes: 934,
    views: 4567,
    isLiked: false,
  },
  {
    id: 7,
    name: "Quantum Butterfly #001",
    description: "A butterfly existing in multiple quantum states",
    image: "https://images.unsplash.com/photo-1444927714506-8492d94b802e?w=400&h=400&fit=crop",
    price: 120,
    currency: "ADA",
    creator: "QuantumArt",
    collection: "Quantum Collection",
    rarity: "Epic",
    likes: 2567,
    views: 11234,
    isLiked: true,
  },
  {
    id: 8,
    name: "Retro Gaming #1985",
    description: "Nostalgic pixel art from the golden age of gaming",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=400&fit=crop",
    price: 35,
    currency: "ADA",
    creator: "RetroGamer",
    collection: "Pixel Perfect",
    rarity: "Common",
    likes: 567,
    views: 3456,
    isLiked: false,
  },
];

export default function Home() {
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
          {placeholderNFTs.map((nft) => (
            <div key={nft.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative">
                <img src={nft.image} alt={nft.name} className="w-full h-64 object-cover" />
              </div>

              {/* NFT Details */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{nft.name}</h3>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold text-purple-600">
                      {nft.price} {nft.currency}
                    </p>
                  </div>
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">Buy Now</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
