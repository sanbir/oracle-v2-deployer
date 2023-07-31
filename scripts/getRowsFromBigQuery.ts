import { BigQuery } from "@google-cloud/bigquery"

export async function getRowsFromBigQuery(valIds: number[]): Promise<{val_id: number, val_amount: number}[]> {
    console.log('BigQuery started...')

    const bigquery = new BigQuery({
        keyFilename: process.env.KEY_FILE_NAME,
        projectId: process.env.PROJECT_ID
    })

    const query = `
        SELECT val_id, sum(
            COALESCE(att_earned_reward, 0) + 
            COALESCE(propose_earned_reward, 0) + 
            COALESCE(sync_earned_reward, 0) - 
            COALESCE(att_penalty, 0) - 
            COALESCE(propose_penalty, 0) - 
            COALESCE(sync_penalty, 0)
        ) as val_amount 
        FROM \`p2p-data-warehouse.raw_ethereum.validators_summary\`
        WHERE val_id IN (${valIds})
        GROUP BY val_id
    `

    const [job] = await bigquery.createQueryJob({
        query: query,
        location: "US"
    })
    const [rows] = await job.getQueryResults()

    console.log('BigQuery finished')

    return rows
}
