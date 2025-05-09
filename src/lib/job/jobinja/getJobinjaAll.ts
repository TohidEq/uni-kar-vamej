import * as cheerio from "cheerio";
import { searchUrl } from "@/lib/searchUrl";
import { Page } from "puppeteer";
// import { setTimeout } from "timers/promises";

export default async function getJobinjaAll(
  keyword: string,
  page: Page
): Promise<JobItem[] | null> {
  const items: JobItem[] = [];

  try {
    await page.goto(searchUrl(keyword, "jobinja"), {
      waitUntil: "networkidle2", //DONE
      timeout: 0,
    });

    // await setTimeout(2000);

    const html = await page.content();
    const $ = cheerio.load(html);

    $(".c-jobListView__list .c-jobListView__item").each((i, element) => {
      const item: JobItem = {
        type: "jobinja",
        url:
          $(element).find(".c-jobListView__titleLink").attr("href") ||
          "https://jobinja.ir/",
        title: $(element)
          .find(".c-jobListView__titleLink")
          .text()
          .trim()
          .replace(/\s*\(.*?پیش\)/, ""),
        caption: null, // No description in this HTML snippet
        salary: -1,
        salaryStart: -1,
        salaryEnd: -1,
        image:
          $(element).find(".o-listView__itemIndicatorImage").attr("src") ||
          null,
        time:
          $(element)
            .find(".c-jobListView__passedDays")
            .text()
            .trim()
            .replace(/[()]/g, "") || null,
        owner:
          $(element)
            .find(".c-jobListView__metaItem")
            .eq(0)
            .find("span")
            .text()
            .trim() || "ناشناس",
        location:
          $(element)
            .find(".c-jobListView__metaItem")
            .eq(1)
            .find("span")
            .text()
            .trim() || null,
        jobType: cleanJobType(
          $(element)
            .find(".c-jobListView__metaItem")
            .eq(2)
            .find("span")
            .first()
            .text()
            .trim()
        ),
      };

      // Ensure required fields are present
      if (item.url && item.title) {
        items.push(item);
      }
    });
  } catch (error) {
    console.error("Error scraping Jobinja:");
    console.error(error);
  }

  return items.length > 0 ? items : null;
}

function cleanJobType(jobTypeText: string): string | null {
  // حذف خطوط جدید، فضاهای اضافی و متن حقوق
  const cleaned = jobTypeText
    .replace(/\n/g, " ") // جایگزینی خطوط جدید با فاصله
    .replace(/\s+/g, " ") // تبدیل چندین فاصله به یک فاصله
    .replace(/\(.*?\)/g, "") // حذف هر چیزی داخل پرانتز (مثل حقوق)
    .trim(); // حذف فضاهای ابتدا و انتها

  return cleaned || null;
}
