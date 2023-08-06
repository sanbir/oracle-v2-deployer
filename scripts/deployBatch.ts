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
    const clientOnlyClRewardsArray = deployDataArray.map(d => d.clientOnlyClRewards)

    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)
    // @ts-ignore
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider)
    const nonce = await provider.getTransactionCount(wallet.address)

    const tx = await batchFactory.createFeeDistributor(
        clientOnlyClRewardsArray,
        clientConfigs,
        {
            gasLimit: 6000000,
            maxPriorityFeePerGas: 100000000,
            maxFeePerGas: 13000000001,
            nonce
        }
    )
    const txReceipt = await tx.wait(1)
    const events: any = txReceipt?.events?.filter((log: any) => log.event === 'FeeDistributorFactory__FeeDistributorCreated')
    if (!events || !events.length) {
        throw Error('No FeeDistributorFactory__FeeDistributorCreated found')
    }

    deployDataArray.forEach((deployData, index) => {
        const clientEvent = events.find((event: any) => event.args?._clientAddress == deployData.clientConfig.recipient)
        if (clientEvent) {
            deployDataArray[index].feeDistributorAddress = clientEvent.args?._newFeeDistributorAddress
        }
    })

    return deployDataArray
}
