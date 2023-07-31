import express, { Express, Request, Response } from 'express'
import multer from 'multer'
import fs from 'fs'
import axios from 'axios'
import FormData from 'form-data'
import {deploy} from "./deploy"

const upload = multer({ dest: 'uploads/' })

const app = express()

app.get('/', (req: Request, res: Response) => {
    res.send('Oracle V2 deploy server')
})

app.get('/recently-deployed-csv', async (req: Request, res: Response) => {
    const outputCsvFilePath = process.env.OUTPUT_CSV_FILE_PATH
    if (!outputCsvFilePath) {
        res.status(500).send('No OUTPUT_CSV_FILE_PATH env')
        return
    }

    // Check if the file exists before sending it
    if (!fs.existsSync(outputCsvFilePath)) {
        res.status(404).send('File not found.')
        return
    }

    // Send the file to the client
    res.sendFile(outputCsvFilePath)
})

app.post('/upload-csv', upload.single('file'), (req: Request, res: Response) => {
    if (!req.file) {
        res.status(400).send('No file in request')
        return
    }

    // Immediately return a HTTP 200 response
    res.status(200).send('File upload received. Processing will begin shortly.')

    // Move the uploaded file to the desired location
    fs.rename(req.file.path, process.env.INPUT_CSV_FILE_PATH!, async (err: any) => {
        if (err) {
            console.error('Could not move uploaded file', err);
            return;
        }

        await deploy()
    });
});

async function sendCsv(url: string) {
    try {
        // Prepare the new CSV file for the POST request
        const form = new FormData();
        form.append('file', fs.createReadStream(process.env.OUTPUT_CSV_FILE_PATH!));

        // Send a POST request to the provided URL with the parsed CSV data
        const response = await axios.post(url, form, {
            headers: form.getHeaders(),
        });

        console.log('Data sent successfully', response.data);
    } catch (err) {
        console.error('Error sending data', err);
    }
}

app.listen(process.env.PORT, () => console.log('Server started on port', process.env.PORT));
