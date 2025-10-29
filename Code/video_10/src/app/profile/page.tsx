/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CardanoWallet } from "@/components/common/cardano-wallet";
import Link from "next/link";

// Placeholder data for wallet NFTs
const walletNFTs = [
  {
    id: 1,
    name: "Cardano Genesis #001",
    description: "A rare genesis NFT from the Cardano ecosystem",
    image: "https://images.unsplash.com/photo-1634017839464-19910a7ec0f2?w=400&h=400&fit=crop",
    collection: "Genesis Collection",
    rarity: "Legendary",
    tokenId: "001",
    contractAddress: "0x1234567890abcdef1234567890abcdef12345678",
    acquiredDate: "2024-01-15",
    acquiredPrice: 150,
    currency: "ADA",
    currentValue: 200,
    isListed: false,
  },
  {
    id: 2,
    name: "Digital Dreams #042",
    description: "Abstract digital art representing the future of blockchain",
    image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop",
    collection: "Abstract Visions",
    rarity: "Epic",
    tokenId: "042",
    contractAddress: "0x2345678901bcdef1234567890abcdef1234567890",
    acquiredDate: "2024-01-20",
    acquiredPrice: 89,
    currency: "ADA",
    currentValue: 120,
    isListed: false,
  },
  {
    id: 3,
    name: "Crypto Cat #1337",
    description: "A cute cat NFT with cyberpunk aesthetics",
    image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop",
    collection: "Feline Friends",
    rarity: "Rare",
    tokenId: "1337",
    contractAddress: "0x3456789012cdef1234567890abcdef1234567890",
    acquiredDate: "2024-02-01",
    acquiredPrice: 45,
    currency: "ADA",
    currentValue: 60,
    isListed: false,
  },
  {
    id: 4,
    name: "Space Explorer #999",
    description: "An astronaut exploring the digital cosmos",
    image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=400&fit=crop",
    collection: "Cosmic Collection",
    rarity: "Legendary",
    tokenId: "999",
    contractAddress: "0x4567890123def1234567890abcdef1234567890",
    acquiredDate: "2024-02-10",
    acquiredPrice: 200,
    currency: "ADA",
    currentValue: 250,
    isListed: false,
  },
];

// Placeholder data for listed NFTs
const listedNFTs = [
  {
    id: 5,
    name: "Neon City #777",
    description: "Cyberpunk cityscape with neon lights",
    image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400&h=400&fit=crop",
    collection: "Cyberpunk Dreams",
    rarity: "Epic",
    tokenId: "777",
    contractAddress: "0x5678901234ef1234567890abcdef1234567890",
    listedDate: "2024-02-15",
    listedPrice: 75,
    currency: "ADA",
    views: 234,
    likes: 45,
    isListed: true,
  },
  {
    id: 6,
    name: "Nature's Code #256",
    description: "Fractal patterns found in nature, digitized",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
    collection: "Digital Nature",
    rarity: "Rare",
    tokenId: "256",
    contractAddress: "0x6789012345f1234567890abcdef1234567890",
    listedDate: "2024-02-20",
    listedPrice: 60,
    currency: "ADA",
    views: 189,
    likes: 32,
    isListed: true,
  },
  {
    id: 7,
    name: "Quantum Butterfly #001",
    description: "A butterfly existing in multiple quantum states",
    image: "https://images.unsplash.com/photo-1444927714506-8492d94b802e?w=400&h=400&fit=crop",
    collection: "Quantum Collection",
    rarity: "Epic",
    tokenId: "001",
    contractAddress: "0x78901234561234567890abcdef1234567890",
    listedDate: "2024-02-25",
    listedPrice: 120,
    currency: "ADA",
    views: 456,
    likes: 78,
    isListed: true,
  },
];

const rarityColors = {
  Common: "bg-gray-100 text-gray-800",
  Rare: "bg-blue-100 text-blue-800",
  Epic: "bg-purple-100 text-purple-800",
  Legendary: "bg-yellow-100 text-yellow-800",
};

export default function ProfilePage() {
  const [selectedNFTs, setSelectedNFTs] = useState<number[]>([]);

  const handleSelectNFT = (nftId: number) => {
    setSelectedNFTs((prev) => (prev.includes(nftId) ? prev.filter((id) => id !== nftId) : [...prev, nftId]));
  };

  const handleListNFTs = () => {
    // In real app, this would list selected NFTs
    console.log("Listing NFTs:", selectedNFTs);
    setSelectedNFTs([]);
  };

  const handleUnlistNFTs = () => {
    // In real app, this would unlist selected NFTs
    console.log("Unlisting NFTs:", selectedNFTs);
    setSelectedNFTs([]);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const totalWalletValue = walletNFTs.reduce((sum, nft) => sum + nft.currentValue, 0);
  const totalListedValue = listedNFTs.reduce((sum, nft) => sum + nft.listedPrice, 0);

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
              <p className="text-gray-600">addr_test1qpc80lcd66vj9xe...gr8tg7cm4xuz9arxcnqux0hml</p>
              <div className="flex space-x-6 mt-2">
                <div>
                  <p className="text-sm text-gray-500">Wallet NFTs</p>
                  <p className="text-lg font-semibold">{walletNFTs.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Listed NFTs</p>
                  <p className="text-lg font-semibold">{listedNFTs.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Value</p>
                  <p className="text-lg font-semibold">{totalWalletValue + totalListedValue} ADA</p>
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
                  {walletNFTs.map((nft) => (
                    <div key={nft.id} className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      <div className="relative">
                        <img src={nft.image} alt={nft.name} className="w-full h-48 object-cover" />
                      </div>

                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1 truncate">{nft.name}</h3>
                        <div className="mt-4 flex space-x-2">
                          <Button asChild className="flex-1 bg-purple-600 hover:bg-purple-700 text-white">
                            <Link href={`/nft/${nft.tokenId}`}>View Details</Link>
                          </Button>
                          <Button variant="outline" className="flex-1" onClick={() => handleSelectNFT(nft.id)}>
                            {selectedNFTs.includes(nft.id) ? "Selected" : "Select"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="listed">
                {/* Listed NFTs Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {listedNFTs.map((nft) => (
                    <div key={nft.id} className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      <div className="relative">
                        <img src={nft.image} alt={nft.name} className="w-full h-48 object-cover" />

                        <div className="absolute bottom-2 left-2 right-2">
                          <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">Listed</div>
                        </div>
                      </div>

                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1 truncate">{nft.name}</h3>

                        <div className="mt-4 flex space-x-2">
                          <Button asChild className="flex-1 bg-purple-600 hover:bg-purple-700 text-white">
                            <Link href={`/nft/${nft.tokenId}`}>Update</Link>
                          </Button>
                          <Button variant="outline" className="flex-1">
                            Delist
                          </Button>
                        </div>
                      </div>
                    </div>
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
