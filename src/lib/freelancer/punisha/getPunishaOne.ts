import * as cheerio from "cheerio";
import { Page } from "puppeteer";
import { persianToEnglishNumber } from "../../parseSalary";

export default async function getPunishaOne(
  url: string,
  page: Page
): Promise<JobItem | null> {
  try {
    await page.goto(url, {
      waitUntil: "domcontentloaded", // DONE
      timeout: 0,
    });

    const html = await page.content();
    const $ = cheerio.load(html);

    const title =
      $(
        "div.MuiBox-root.css-1lekzkb > span.MuiTypography-root.MuiTypography-h2.css-cy60r3"
      )
        .text()
        .trim() || "بدون عنوان";
    const caption =
      $(".MuiTypography-root.MuiTypography-subtitle1.css-vuyg52")
        .text()
        .trim() || null;

    const salaryText = $(
      "div.MuiTypography-root.MuiTypography-subtitle1.css-ri6noj"
    )
      .first()
      .text()
      .trim();
    // console.log("Found salaryText:", salaryText);

    const salaryNum = salaryText ? persianToEnglishNumber(salaryText) : null;
    // console.log("Parsed salaryNum:", salaryNum);

    const time =
      $("span.MuiTypography-root.MuiTypography-subtitle1.css-1d78yk")
        .text()
        .trim() || null;

    const location = null;
    const jobType = null;
    const owner = $("div.MuiBox-root.css-1nsfdkm")
      .text()
      .trim()
      .replace("کارفرما این پروژه است.", "");

    const item: JobItem = {
      type: "punisha",
      url,
      title,
      caption,
      salary: salaryNum !== null ? salaryNum : -1,
      salaryStart: salaryNum,
      salaryEnd: salaryNum,
      image: null,
      time,
      owner,
      location,
      jobType,
    };

    if (!item.url || !item.title) {
      console.warn("Missing required fields for Punisha item:", { url, title });
      return null;
    }

    return item;
  } catch (error) {
    console.error("Error scraping Punisha for URL:", url);
    console.error(error);
    return null;
  }
}
