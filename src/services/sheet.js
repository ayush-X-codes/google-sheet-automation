import { google } from "googleapis";
import { fileURLToPath } from "url";
import { configDotenv } from "dotenv";
import path from "path";
import fs from "fs/promises";

configDotenv();

const SCOPES = "https://www.googleapis.com/auth/spreadsheets";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fileToRead = path.join(__dirname, "..", "/data/books.json");
console.log("full file path is: ", fileToRead);

const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json",
  scopes: SCOPES,
});

const sheets = google.sheets({ version: "v4", auth: auth });
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

const RANGE = "sheet1!A1";

async function writeToGoogleSheet() {
  try {
    const fileDataRaw = await fs.readFile(fileToRead, "utf8");
    const jsonData = JSON.parse(fileDataRaw);

    const CHUNK_SIZE = 50;

    const dataToSend = jsonData.map((item) => [
      item.name,
      item.price,
      item.rating,
      item.availability,
    ]);

    for (let i = 0; i < dataToSend.length; i += CHUNK_SIZE) {
      console.log("iterations: ", i)
      console.log("iterations by fifity: ", i+= CHUNK_SIZE)
      console.log("iterations by slice: ", [i, CHUNK_SIZE+ i])

      const chunk = dataToSend.slice(i, i + CHUNK_SIZE);

      const response = await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: RANGE,
        valueInputOption: "USER_ENTERED",
        insertDataOption: "INSERT_ROWS",
        requestBody: {
          values: chunk,
        },
      });

    }

    console.log("✅ Data writes successfully");
  } catch (error) {
    console.error("Google sheet error: ", error.message);
  }
}

writeToGoogleSheet()

export { writeToGoogleSheet };
