import { MarketplaceContract } from "@/contract";
import { blockfrostProvider } from "@/lib/blockfrost";
import { MeshWallet, Network } from "@meshsdk/core";

export async function POST(request: Request) {
  try {
    const { address, signedTx } = await request.json();

    if (!address) {
      throw new Error("Wallet not connected");
    }
    if (!signedTx) {
      throw new Error("signedTx is null");
    }

    const txHash = blockfrostProvider.submitTx(signedTx);

    return Response.json(
      {
        result: true,
        data: txHash,
        message: "Transaction created successfully",
      },
      { status: 200 },
    );
  } catch (e) {
    console.error(e);
    return Response.json({ result: false, data: null, message: e instanceof Error ? e.message : JSON.stringify(e) }, { status: 500 });
  }
}
