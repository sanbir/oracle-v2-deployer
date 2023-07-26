import "dotenv/config"
import {getDeployDataArray} from "./scripts/getDeployDataArray";
import {deployBatch} from "./scripts/deployBatch";
import {DeployData} from "./scripts/models/DeployData";
import {writeToCsv} from "./scripts/helpers/writeToCsv";

async function main() {
    const deployDataArray = await getDeployDataArray()

    const batchSize = 50
    const updatedDeployDataArray: DeployData[] = []
    for (let i = 0; i < (deployDataArray.length / batchSize); i++) {
        console.log('deploying batch #', i, '...')
        const updatedDeployDataArray1 = await deployBatch(deployDataArray.slice(i * batchSize, (i + 1) * batchSize))
        updatedDeployDataArray.push(...updatedDeployDataArray1)
        console.log('batch #', i, 'deployed')
    }

    writeToCsv(updatedDeployDataArray)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
