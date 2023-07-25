import {getFactorySigned} from "./getFactorySigned";

export async function getFeeDistributorsFromLogs() {
    const factory = getFactorySigned()
    const filter = factory.filters.FeeDistributorCreated(null, null)
    let result = await factory.queryFilter(filter, 0, "latest")
    const feeDistributors: string[] = result.map(event => event.args?._newFeeDistributorAddress)

    return feeDistributors
}
