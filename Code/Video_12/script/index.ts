import {
    conStr0,
    deserializeAddress,
    parseAssetUnit,
    integer as toInteger,
    pubKeyAddress as toPubKeyAddress,
    policyId as toPolicyId,
    assetName as toAssetName,
    mConStr0,
    mConStr1
} from "@meshsdk/core";
import { MeshAdapter } from "./mesh";

export class MarketplaceContract extends MeshAdapter {

    sell = async ({ unit, priceInLovelace }: { unit: string; priceInLovelace: number }): Promise<string> => {
        const { utxos, walletAddress, collateral } = await this.getWalletForTx();
        const { pubKeyHash, stakeCredentialHash } = deserializeAddress(walletAddress)
        const { policyId, assetName } = parseAssetUnit(unit)
        const nftUtxo = await this.getAddressUTXOAssets(walletAddress, unit)
        if (!nftUtxo) {
            throw new Error("NFT Utxo Not Found")
        }
        const unsignedTx = this.meshTxBuilder
            .spendingPlutusScriptV3()
            .txOut(this.marketplaceAddress, [
                {
                    unit: unit,
                    quantity: "1"
                }
            ])
            .txOutInlineDatumValue(
                conStr0([
                    toPubKeyAddress(pubKeyHash, stakeCredentialHash),
                    toInteger(priceInLovelace),
                    toPolicyId(policyId),
                    toAssetName(assetName)
                ]),
                "JSON"
            )
            .changeAddress(walletAddress)
            .requiredSignerHash(pubKeyHash)
            .selectUtxosFrom(utxos)
            .txInCollateral(collateral.input.txHash, collateral.input.outputIndex, collateral.output.amount, collateral.output.address)
            .setNetwork(this.network)

        return await unsignedTx.complete()
    }

    buy = async ({ unit }: { unit: string }): Promise<string> => {
        const { utxos, walletAddress, collateral } = await this.getWalletForTx();
        const { pubKeyHash } = deserializeAddress(walletAddress)
        const nftUtxo = await this.getAddressUTXOAsset(this.marketplaceAddress, unit)
        if (!nftUtxo) {
            throw new Error("NFT Utxo Not Found")
        }
        const datum = this.readPlutusData(nftUtxo.output.plutusData || "")
        const nftLovelace = Number(nftUtxo.output.amount.find((a) => a.unit === "lovelace")!.quantity)
        const unsignedTx = this.meshTxBuilder
            .spendingPlutusScriptV3()
            .txIn(nftUtxo.input.txHash, nftUtxo.input.outputIndex)
            .txInInlineDatumPresent()
            .txInRedeemerValue(mConStr0([]))
            .txInScript(this.marketplaceScriptCbor)
            .txOut(datum.seller, [
                {
                    unit: "lovelace",
                    quantity: String(datum.price + nftLovelace)
                }
            ])
            .txOut(walletAddress, [
                {
                    unit: unit,
                    quantity: "1"
                }
            ])
            .changeAddress(walletAddress)
            .requiredSignerHash(pubKeyHash)
            .selectUtxosFrom(utxos)
            .txInCollateral(collateral.input.txHash, collateral.input.outputIndex, collateral.output.amount, collateral.output.address)
            .setNetwork(this.network)

        return await unsignedTx.complete()
    }

    withdraw = async ({ unit }: { unit: string }): Promise<string> => {
        const { utxos, walletAddress, collateral } = await this.getWalletForTx();
        const { pubKeyHash } = deserializeAddress(walletAddress)
        const nftUtxo = await this.getAddressUTXOAsset(this.marketplaceAddress, unit)
        if (!nftUtxo) {
            throw new Error("NFT Utxo Not Found")
        }

        const unsignedTx = this.meshTxBuilder
            .spendingPlutusScriptV3()
            .txIn(nftUtxo.input.txHash, nftUtxo.input.outputIndex)
            .txInInlineDatumPresent()
            .txInRedeemerValue(mConStr1([]))
            .txInScript(this.marketplaceScriptCbor)
            .txOut(walletAddress, [
                {
                    unit: unit,
                    quantity: "1"
                }
            ])
            .changeAddress(walletAddress)
            .requiredSignerHash(pubKeyHash)
            .selectUtxosFrom(utxos)
            .txInCollateral(collateral.input.txHash, collateral.input.outputIndex, collateral.output.amount, collateral.output.address)
            .setNetwork(this.network)

        return await unsignedTx.complete()
    }

    update = async ({ unit, newPriceInLovelace }: { unit: string; newPriceInLovelace: number }): Promise<string> => {
        const { utxos, walletAddress, collateral } = await this.getWalletForTx();
        const { pubKeyHash, stakeCredentialHash } = deserializeAddress(walletAddress)
        const { policyId, assetName } = parseAssetUnit(unit)
        const nftUtxo = await this.getAddressUTXOAsset(this.marketplaceAddress, unit)
        if (!nftUtxo) {
            throw new Error("NFT Utxo Not Found")
        }
        const unsignedTx = this.meshTxBuilder
            .spendingPlutusScriptV3()
            .txIn(nftUtxo.input.txHash, nftUtxo.input.outputIndex)
            .txInInlineDatumPresent()
            .txInRedeemerValue(mConStr1([]))
            .txInScript(this.marketplaceScriptCbor)
            .txOut(this.marketplaceAddress, [
                {
                    unit: unit,
                    quantity: "1"
                }
            ])
            .txOutInlineDatumValue(
                conStr0([
                    toPubKeyAddress(pubKeyHash, stakeCredentialHash),
                    toInteger(newPriceInLovelace),
                    toPolicyId(policyId),
                    toAssetName(assetName)
                ]),
                "JSON"
            )
            .changeAddress(walletAddress)
            .requiredSignerHash(pubKeyHash)
            .selectUtxosFrom(utxos)
            .txInCollateral(collateral.input.txHash, collateral.input.outputIndex, collateral.output.amount, collateral.output.address)
            .setNetwork(this.network)

        return await unsignedTx.complete()
    }
}