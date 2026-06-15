import { scrapeBooks } from "../services/scraper.js";
import fs from "fs/promises";
import { writeToGoogleSheet } from "../services/sheet.js";

async function runAutomation() {
  console.log("Starting scraping");
  await scrapeBooks();
  await writeToGoogleSheet();
}

export { runAutomation };
