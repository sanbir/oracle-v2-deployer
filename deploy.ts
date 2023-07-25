import "dotenv/config"
import {getDeployDataArray} from "./scripts/getDeployDataArray";
import {deployBatch} from "./scripts/deployBatch";
import {DeployData} from "./scripts/models/DeployData";

async function main() {
    const deployDataArray = await getDeployDataArray()

    const batchSize = 50
    const updatedDeployDataArray: DeployData[] = []
    for (let i = 0; i < deployDataArray.length / batchSize; i++) {
        const updatedDeployDataArray1 = await deployBatch(deployDataArray.slice(i * batchSize, (i + 1) * batchSize))
        updatedDeployDataArray.push(...updatedDeployDataArray1)
    }

    console.log("pubkey,fee_divider")
    updatedDeployDataArray?.map(d => console.log(d?.pubkey + ',' + d?.feeDistributorAddress))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
