import {CsvEntry} from "../models/CsvEntry";
import {getValidatorIndexesFromBigQuery} from "./getValidatorIndexesFromBigQuery";

export async function attachValidatorIndexes(csvEntries: CsvEntry[]) {
    const rows = await getValidatorIndexesFromBigQuery(csvEntries.map(en => en.validator_key))

    csvEntries.forEach((en, index, array) => {
        array[index].validator_index = rows.find(r => r.val_pubkey === en.validator_key).val_id
    })
}


