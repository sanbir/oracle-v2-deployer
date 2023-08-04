import {BigQuery} from "@google-cloud/bigquery";

export async function getValidatorIndexesFromBigQuery(val_pubkeys: string[]) {
    console.log('Getting indexes from BigQuery....')

    const bigquery = new BigQuery({
        keyFilename: process.env.KEY_FILE_NAME,
        projectId: process.env.PROJECT_ID
    })

    const query = `
        SELECT val_id, val_pubkey FROM \`p2p-data-warehouse.raw_ethereum.validators_index\`
        WHERE val_pubkey IN (${"'" + val_pubkeys.join("','") + "'"})
    `

    const [job] = await bigquery.createQueryJob({
        query: query,
        location: "US"
    })
    const [rows] = await job.getQueryResults()

    console.log('Indexes from BigQuery fetched')
    return rows
}
