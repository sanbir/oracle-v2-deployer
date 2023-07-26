import {CsvEntry} from "../models/CsvEntry";
import {ClientConfig} from "../models/ClientConfig";

export function fromCsvEntryToClientConfig(csvEntry:  CsvEntry): ClientConfig {
    const clientConfig: ClientConfig = {
        recipient: csvEntry.withdrawal_address,
        basisPoints: csvEntry.fee === 0 ? Number(process.env.DEFAULT_CLIENT_BASIS_POINTS) : 10000 - csvEntry.fee * 10000
    }
    return clientConfig
}