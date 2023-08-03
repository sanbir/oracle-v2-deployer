import {DeployData} from "../models/DeployData";
import * as fs from "fs";
import {CsvEntry} from "../models/CsvEntry";

export function writeToCsv(deployDataArray: DeployData[], csvEntries: CsvEntry[]) {
    let textToWrite = 'pubkey,fee_divider\n'

    csvEntries.forEach(row => {
        const feeDistributorAddress = deployDataArray.find(
            d => d.clientConfig.recipient === row.withdrawal_address
        )?.feeDistributorAddress
        textToWrite += (row?.validator_key + ',' + feeDistributorAddress + '\n')
    })

    const filePath = process.env.OUTPUT_CSV_FILE_PATH!

    fs.writeFileSync(filePath, textToWrite)

    console.log('Saved to', filePath);
}
