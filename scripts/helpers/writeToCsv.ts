import {DeployData} from "../models/DeployData";
import * as fs from "fs";

export function writeToCsv(deployDataArray: DeployData[]) {
    let textToWrite = 'pubkey,fee_divider\n'

    deployDataArray?.forEach(d => textToWrite += (d?.pubkey + ',' + d?.feeDistributorAddress + '\n'))

    const filePath = process.env.OUTPUT_CSV_FILE_PATH!

    fs.writeFileSync(filePath, textToWrite)

    console.log('Saved to', filePath);
}
