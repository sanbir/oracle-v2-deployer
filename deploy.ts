import "dotenv/config"
import {getDeployDataArray} from "./scripts/getDeployDataArray";
import {ethers} from "ethers";
import {getFactorySigned} from "./scripts/helpers/getFactorySigned";
import {deployOne} from "./scripts/deployOne";
import {DeployData} from "./scripts/models/DeployData";
import {deployBatch} from "./scripts/deployBatch";

async function main() {
    const deployDataArray = await getDeployDataArray()

    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)
    // @ts-ignore
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider)
    const initialNonce = await provider.getTransactionCount(wallet.address)

    // const deployPromises = deployDataArray.map(async (deployData, index) => {
    //     try {
    //         const updatedDeployData = await deployOne(deployData, initialNonce, index)
    //         return updatedDeployData
    //     } catch (err) {
    //         console.error('Error in', index, deployData, err)
    //     }
    // })
    // const updatedDeployDataArray = await Promise.all(deployPromises)


    // const updatedDeployDataArray: DeployData[] = []
    // for (let i = 0; i < deployDataArray.length; i++) {
    //     const updatedDeployData = await deployOne(deployDataArray[i], initialNonce, i)
    //     updatedDeployDataArray.push(updatedDeployData)
    // }

    const updatedDeployDataArray1 = await deployBatch(deployDataArray.slice(0, 50))
    const updatedDeployDataArray2 = await deployBatch(deployDataArray.slice(50, 100))
    const updatedDeployDataArray3 = await deployBatch(deployDataArray.slice(100, 150))
    const updatedDeployDataArray = [...updatedDeployDataArray1, ...updatedDeployDataArray2, ...updatedDeployDataArray3]

    console.log("pubkey,fee_divider")
    updatedDeployDataArray?.map(d => console.log(d?.pubkey + ',' + d?.feeDistributorAddress))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
