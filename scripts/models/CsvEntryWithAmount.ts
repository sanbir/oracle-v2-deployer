import {CsvEntry} from "./CsvEntry";
import {ethers} from "ethers";

export interface CsvEntryWithAmount extends CsvEntry {
    val_amount: ethers.BigNumber
}
