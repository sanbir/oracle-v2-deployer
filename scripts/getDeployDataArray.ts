import {getLastUsedContractId} from "./helpers/getLastUsedContractId";
import {readFromCsv} from "./helpers/readFromCsv";
import {getRowsFromBigQuery} from "./getRowsFromBigQuery";
import {CsvEntryWithAmount} from "./models/CsvEntryWithAmount";
import {ethers} from "ethers";
import {DeployData} from "./models/DeployData";
import {fromCsvEntryToClientConfig} from "./helpers/fromCsvEntryToClientConfig";
import {ValidatorData} from "./models/ValidatorData";

export async function getDeployDataArray() {
    const lastUsedContractId = await getLastUsedContractId()
    let startingFirstValidatorId = lastUsedContractId + 1000

    const csvEntries = await readFromCsv()

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
        const existingEntry = accumulator.find(entry => entry.clientConfig.recipient === csvEntry.withdrawal_address);

        if (existingEntry) {
            // If it does, simply add the val_amount
            existingEntry.validatorData.clientOnlyClRewards = existingEntry.validatorData.clientOnlyClRewards.add(csvEntry.val_amount);
        } else {
            // If it doesn't, add a new entry to the accumulator

            const clientConfig = fromCsvEntryToClientConfig(csvEntry)
            const validatorData: ValidatorData = {
                firstValidatorId: startingFirstValidatorId++,
                validatorCount: 1,
                clientOnlyClRewards: csvEntry.val_amount
            }
            const pubkey = csvEntry.validator_key
            const feeDistributorAddress = ''

            const deployData: DeployData = {
                clientConfig,
                validatorData,
                pubkey,
                feeDistributorAddress
            }

            accumulator.push(deployData);
        }

        return accumulator;
    }, [])

    return deployDataArray
}
