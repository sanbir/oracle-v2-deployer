import {readFromCsv} from "./helpers/readFromCsv";
import {getRowsFromBigQuery} from "./getRowsFromBigQuery";
import {CsvEntryWithAmount} from "./models/CsvEntryWithAmount";
import {ethers} from "ethers";
import {DeployData} from "./models/DeployData";
import {fromCsvEntryToClientConfig} from "./helpers/fromCsvEntryToClientConfig";
import {attachValidatorIndexes} from "./helpers/attachValidatorIndexes";
import {fromFeeToBasisPoints} from "./helpers/fromFeeToBasisPoints";

export async function getDeployDataArray() {
    const csvEntries = await readFromCsv()
    await attachValidatorIndexes(csvEntries)

    const arrayFromBq = await getRowsFromBigQuery(csvEntries.map(en => en.validator_index))

    const csvEntriesWithAmount: CsvEntryWithAmount[] = csvEntries.map(entry => ({
        ...entry,
        val_amount: ethers.BigNumber.from(
            arrayFromBq.find(pair => pair.val_id === entry.validator_index)?.val_amount
        ).mul(1e9)
    }))

    const deployDataArray = csvEntriesWithAmount.reduce((
        accumulator: DeployData[],
        csvEntry
    ) => {
        // Check if an entry with the same oracleId already exists in the accumulator
        const existingEntry = accumulator.find(
            entry => entry.clientConfig.recipient === csvEntry.withdrawal_address
                && entry.clientConfig.basisPoints === fromFeeToBasisPoints(csvEntry.fee)
        );

        if (existingEntry) {
            // If it does, simply add the val_amount
            existingEntry.clientOnlyClRewards = existingEntry.clientOnlyClRewards.add(csvEntry.val_amount);
        } else {
            // If it doesn't, add a new entry to the accumulator

            const clientConfig = fromCsvEntryToClientConfig(csvEntry)
            const pubkey = csvEntry.validator_key
            const feeDistributorAddress = ''
            const clientOnlyClRewards = csvEntry.val_amount

            const deployData: DeployData = {
                clientConfig,
                pubkey,
                feeDistributorAddress,
                clientOnlyClRewards
            }

            accumulator.push(deployData);
        }

        return accumulator;
    }, [])

    return {deployDataArray, csvEntries}
}
