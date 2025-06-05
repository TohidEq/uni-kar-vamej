import * as cheerio from "cheerio";
import { Page } from "puppeteer";
import { convertSalaryRangeToNumbers } from "../../parseSalary";

export default async function getJobVisionOne(
  url: string,
  page: Page
): Promise<JobItem | null> {
  try {
    // Navigate to the provided URL
    await page.goto(url, {
      // waitUntil: "domcontentloaded", // DONE
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
    const salaryText = $(".yn_price").first().text().trim() || "";
    console.log(`salar:: ${salaryText}`);
    const salaryNum = salaryText
      ? convertSalaryRangeToNumbers(salaryText)
      : null;

    // Extract time posted from time element datetime attribute or text
    const timeElement = $(".font-size-5.font-weight.mr-2.text-muted").first();
    const time = timeElement
      ? timeElement.text().trim().replace(")", "").replace("(", "")
      : null;

    // Extract location
    const location = $(".text-muted.font-size-6.yn_category.ng-star-inserted")
      .first()
      .text()
      .trim();

    // Extract job type (e.g. تمام وقت)
    const jobType = $(".font-size-6.ml-3.text-muted").first().text().trim();

    // Extract main image URL (company header image)
    const image =
      "https://jobvision.ir" +
      ($("img.object-fit-contain").first().attr("src") || "");

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
      salary: salaryNum !== null ? salaryNum[1] : -1,
      salaryStart: salaryNum !== null ? salaryNum[0] : null,
      salaryEnd: salaryNum !== null ? salaryNum[1] : null,
      image,
      time,
      owner,
      location,
      jobType,
      id: url,
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
