import {CsvEntry} from "../models/CsvEntry";
import {ClientConfig} from "../models/ClientConfig";
import {fromFeeToBasisPoints} from "./fromFeeToBasisPoints";

export function fromCsvEntryToClientConfig(csvEntry:  CsvEntry): ClientConfig {
    const clientConfig: ClientConfig = {
        recipient: csvEntry.withdrawal_address,
        basisPoints: fromFeeToBasisPoints(csvEntry.fee)
    }
    return clientConfig
}
