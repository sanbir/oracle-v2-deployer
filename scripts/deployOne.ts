import {DeployData} from "./models/DeployData";
import {getFactorySigned} from "./helpers/getFactorySigned";
import {ethers} from "ethers";

export async function deployOne(
    deployData: DeployData,
    initialNonce: number,
    index: number) {

    const factory = getFactorySigned()

    const clientConfig = deployData.clientConfig
    const validatorData = deployData.validatorData

    const nonce = initialNonce + index

    const tx = await factory.createFeeDistributor(
        clientConfig,
        { recipient: ethers.constants.AddressZero, basisPoints: 0 },
        validatorData,
        {
            gasLimit: 200000,
            maxPriorityFeePerGas: 1000000000,
            maxFeePerGas: 50000000000,
            nonce
        }
    )
    const txReceipt = await tx.wait(1)
    const event: any = txReceipt?.events?.find((log: any) => log.event === 'FeeDistributorCreated')
    if (!event) {
        throw Error('No FeeDistributorCreated found')
    }
    // retrieve client instance address from event
    const newlyCreatedFeeDistributorAddress = event.args?._newFeeDistributorAddress
    deployData.feeDistributorAddress = newlyCreatedFeeDistributorAddress

    console.log(nonce, newlyCreatedFeeDistributorAddress, 'deployed')

    return deployData
}
