import { MarketplaceContract } from "@/contract";
import { blockfrostProvider } from "@/lib/blockfrost";
import { MeshWallet, Network } from "@meshsdk/core";

export async function POST(request: Request) {
  try {
    const { address, unit } = await request.json();

    if (!address) {
      throw new Error("Wallet not connected");
    }
    if (!unit) {
      throw new Error("Asset not found");
    }

    const wallet = new MeshWallet({
      networkId: (process.env.BLOCKFROST_PROJECT_ID?.slice(0, 7) as Network) == "mainnet" ? 1 : 0,
      fetcher: blockfrostProvider,
      submitter: blockfrostProvider,
      key: {
        type: "address",
        address: address,
      },
    });

    const contract: MarketplaceContract = new MarketplaceContract({
      wallet: wallet,
      fetcher: blockfrostProvider,
      blockfrostProvider: blockfrostProvider,
    });

    const unsignedTx: string = await contract.buy({
      unit: unit,
    });

    return Response.json(
      {
        result: true,
        data: unsignedTx,
        message: "Transaction created successfully",
      },
      { status: 200 },
    );
  } catch (e) {
    console.error(e);
    return Response.json({ result: false, data: null, message: e instanceof Error ? e.message : JSON.stringify(e) }, { status: 500 });
  }
}
