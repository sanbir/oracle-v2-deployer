import {getFeeDistributorsFromLogs} from "./getFeeDistributorsFromLogs";
import {getFeeDistributorContract} from "./getFeeDistributorContract";

export async function getLastUsedContractId(): Promise<number> {
    const feeDistributors = await getFeeDistributorsFromLogs()
    const feeDistributorAddress = feeDistributors[feeDistributors.length - 1]
    const contract = getFeeDistributorContract(feeDistributorAddress)
    const id = await contract.firstValidatorId()
    return id.toNumber()
}
