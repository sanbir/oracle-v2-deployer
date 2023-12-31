import * as fs from "fs";
import {parse} from "csv-parse";
import "dotenv/config"
import {CsvEntry} from "../models/CsvEntry";
import {ethers} from "ethers";

export async function readFromCsv(): Promise<CsvEntry[]> {
    return new Promise((resolve, reject) => {
        const words: CsvEntry[] = [];

        fs.createReadStream(process.env.INPUT_CSV_FILE_PATH! + '/input.csv')
            .pipe(parse({
                cast: (value, context) => {
                    if (context.column === 'validator_index' || context.column === 'fee') return Number(value)
                    if (context.column === 'fee_recipient') return ethers.utils.getAddress(value)
                    return value
                },
                delimiter: ',',
                columns: true,
                trim: true,
            }))
            .on('data', function (csvrow) {
                words.push(csvrow);
            })
            .on('end', function () {
                resolve(words)
            })
            .on('error', function (err) {
                reject(err);
            });
    })
}
