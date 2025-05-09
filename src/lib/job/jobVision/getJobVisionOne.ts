import * as cheerio from "cheerio";
import { Page } from "puppeteer";
import { persianToEnglishNumber } from "../../parseSalary";

export default async function getJobVisionOne(
  url: string,
  page: Page
): Promise<JobItem | null> {
  try {
    // Navigate to the provided URL
    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 0,
    });

    // Get page content
    const html = await page.content();
    const $ = cheerio.load(html);

    // Extract job title
    const title = $("h1.yn_title").text().trim() || "بدون عنوان";

    // Extract company/owner name
    const owner = $("a.yn_brand").first().text().trim() || "";

    // Extract salary text and parse
    const salaryText = $("span.yn_price").first().text().trim() || "";
    const salaryNum = salaryText ? persianToEnglishNumber(salaryText) : null;

    // Extract time posted from time element datetime attribute or text
    const timeElement = $("time[datetime]").first();
    const time = timeElement.length > 0 ? timeElement.text().trim() : null;

    // Extract location
    const location = $("span.yn_category").first().text().trim() || null;

    // Extract job type (e.g. تمام وقت)
    // The job type text is inside a div with class font-size-6 ml-3 text-muted near location
    // We'll try to find the sibling div with that class near location span
    let jobType = null;
    const locationDiv = $("span.yn_category").first().closest("div");
    if (locationDiv.length > 0) {
      const jobTypeDiv = locationDiv
        .siblings("div.font-size-6.ml-3.text-muted")
        .first();
      if (jobTypeDiv.length > 0) {
        jobType = jobTypeDiv.text().trim();
      }
    }

    // Extract main image URL (company header image)
    const image = $("img.yn_image").first().attr("src") || null;

    // Extract caption or job description summary
    // Using the job description text inside the div with class col px-0 mr-2 containing job details
    // Or fallback to company description paragraph text
    let caption = null;
    const jobDescriptionDiv = $("div.col.px-0.mr-2").first();
    if (jobDescriptionDiv.length > 0) {
      caption = jobDescriptionDiv.text().trim() || null;
    }
    if (!caption) {
      const companyDesc = $(
        "app-job-detail-about-company p.text-muted"
      ).first();
      if (companyDesc.length > 0) {
        caption = companyDesc.text().trim() || null;
      }
    }

    const item: JobItem = {
      type: "jobvision",
      url: url,
      title,
      caption,
      salary: salaryNum !== null ? salaryNum : -1,
      salaryStart: null,
      salaryEnd: null,
      image,
      time,
      owner,
      location,
      jobType,
    };

    // Ensure required fields are present
    if (!item.url || !item.title) {
      console.warn("Missing required fields for JobVision item:", {
        url,
        title,
      });
      return null;
    }

    return item;
  } catch (error) {
    console.error("Error scraping JobVision for URL:", url);
    console.error(error);
    return null;
  }
}
