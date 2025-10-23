import { MeshAdapter } from "@/contract/mesh";
import { blockfrostProvider } from "@/lib/blockfrost";
import { Datum } from "@/types";

export async function GET() {
  try {
    const mesh = new MeshAdapter({});
    const utxos = await blockfrostProvider.fetchAddressUTxOs(mesh.marketplaceAddress);
    const result: Datum[] = utxos.map((utxo) => mesh.readPlutusData(utxo.output.plutusData as string)).filter((datum) => datum != null);
    return Response.json({
      data: result,
    });
  } catch (e) {
    console.error(e);
    return Response.json({ data: [], message: e instanceof Error ? e.message : JSON.stringify(e) }, { status: 500 });
  }
}
