import * as cheerio from "cheerio";
import { Page } from "puppeteer";
import { setTimeout } from "timers/promises";

export default async function getKarlancerOne(
  url: string,
  page: Page
): Promise<JobItem | null> {
  try {
    // Navigate to the provided URL
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 0,
    });

    // Wait for content to load
    await setTimeout(2000);

    // Get page content
    const html = await page.content();
    const $ = cheerio.load(html);

    // Extract data based on JobItem interface
    const title = $("h1.fs-18.font-weight-bold").text().trim() || "بدون عنوان";
    const caption =
      $("div.text-right.white-space-pre-line.lh-2-31.fs-14").text().trim() ||
      null;
    const salaryStartText = $('div.d-flex:contains("از")')
      .find("div")
      .last()
      .text()
      .trim()
      .replace(/[^\d]/g, "");
    const salaryEndText = $('div.d-flex:contains("تا")')
      .find("div")
      .last()
      .text()
      .trim()
      .replace(/[^\d]/g, "");
    const time =
      $("span.fs-13.br-90.px-3.py-2.bg-39-color").text().trim() || null;
    const location =
      $("div.d-none.d-sm-block:contains('تهران')").text().trim() || null;
    const jobType =
      $("app-skill-box:contains('استخدام حضوری')")
        .find("span.ellipsis")
        .text()
        .trim() || null;
    const owner = "کارلنسر"; // No specific owner name in HTML, using default

    const item: JobItem = {
      type: "karlancer",
      url: url,
      title,
      caption,
      salary: -1, // Not explicitly provided in HTML
      salaryStart: salaryStartText ? parseInt(salaryStartText) : null,
      salaryEnd: salaryEndText ? parseInt(salaryEndText) : null,
      image: null, // No image URL found in provided HTML
      time,
      owner,
      location,
      jobType,
    };

    // Ensure required fields are present
    if (!item.url || !item.title) {
      console.warn("Missing required fields for Karlancer item:", {
        url,
        title,
      });
      return null;
    }

    return item;
  } catch (error) {
    console.error("Error scraping Karlancer for URL:", url);
    console.error(error);
    return null;
  }
}
