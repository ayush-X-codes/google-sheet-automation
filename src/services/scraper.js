import * as cheerio from "cheerio";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const file = "/data/books.json";

let books = [];

async function scrapeBooks() {
  try {
    for (let i = 1; i < 51; i++) {
      const response = await fetch(
        `https://books.toscrape.com/catalogue/page-${i}.html`,
      );

      if (!response.ok) {
        throw new Error("Failed to get data from internet");
      }

      const html = await response.text();

      const $ = cheerio.load(html);

      $(".product_pod").each((i, el) => {
        const bookName = $(el).find("h3 a").attr("title");

        const price = $(el).find(".price_color").text();

        const cleanPrice = Number(price.replace(/[^\d.]/g, ""));

        const availability = $(el).find(".availability").text().trim();

        const classAttr = $(el).find(".star-rating").attr("class");

        const rating = classAttr.split(" ")[1].trim();

        const result = {
          name: bookName,
          price: cleanPrice,
          rating: rating,
          availability: availability,
        };

        books.push(result);
      });
    }

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const filePath = path.join(__dirname, "..", file);

    fs.writeFile(filePath, JSON.stringify(books, null, 2), "utf8", (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return;
      }
      console.log("File written successfully!");
    });
  } catch (error) {
    console.error("An Error occurred: ", error);
  }
}

export { scrapeBooks };
