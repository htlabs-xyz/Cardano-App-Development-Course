export type Datum = {
  unit: string;
  seller: string;
  price: string;
};

export type NFT = Datum & {
  metadata: Record<string, string>;
};

export type TransactionAction = "sell" | "buy" | "update" | "withdraw";
