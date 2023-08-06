import "dotenv/config"
import {getDeployDataArray} from "./scripts/getDeployDataArray";
import {deployBatch} from "./scripts/deployBatch";
import {DeployData} from "./scripts/models/DeployData";
import {writeToCsv} from "./scripts/helpers/writeToCsv";

export async function deploy() {
    try {
        const {deployDataArray, csvEntries} = await getDeployDataArray()

        const batchSize = 27
        const updatedDeployDataArray: DeployData[] = []
        for (let i = 0; i < (deployDataArray.length / batchSize); i++) {
            console.log('deploying batch #', i, '...')
            const updatedDeployDataArray1 = await deployBatch(deployDataArray.slice(i * batchSize, (i + 1) * batchSize))
            updatedDeployDataArray.push(...updatedDeployDataArray1)
            console.log('batch #', i, 'deployed')
        }

        writeToCsv(updatedDeployDataArray, csvEntries)
    } catch (error) {
        console.error('Error on deploy', error);
    }
}
