import {DeployData} from "./models/DeployData";
import {getFactorySigned} from "./helpers/getFactorySigned";
import {ethers} from "ethers";
import {getBatchFactorySigned} from "./helpers/getBatchFactorySigned";

export async function deployBatch(
    deployDataArray: DeployData[]
) {

    if (!deployDataArray.length) {
        return []
    }

    const batchFactory = getBatchFactorySigned()

    const clientConfigs = deployDataArray.map(d => d.clientConfig)
    const validatorDatas = deployDataArray.map(d => d.validatorData)

    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)
    // @ts-ignore
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider)
    const nonce = await provider.getTransactionCount(wallet.address)

    const tx = await batchFactory.createFeeDistributor(
        clientConfigs,
        validatorDatas,
        {
            gasLimit: 6000000,
            maxPriorityFeePerGas: 3000000000,
            maxFeePerGas: 50000000000,
            nonce
        }
    )
    const txReceipt = await tx.wait(1)
    const events: any = txReceipt?.events?.filter((log: any) => log.event === 'FeeDistributorCreated')
    if (!events || !events.length) {
        throw Error('No FeeDistributorCreated found')
    }

    deployDataArray.forEach((deployData, index) => {
        const clientEvent = events.find((event: any) => event.args?._clientAddress == deployData.clientConfig.recipient)
        if (clientEvent) {
            deployDataArray[index].feeDistributorAddress = clientEvent.args?._newFeeDistributorAddress
        }
    })

    return deployDataArray
}
