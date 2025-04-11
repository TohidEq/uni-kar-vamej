import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import { searchUrl } from "@/lib/searchUrl";

function cleanJobType(jobTypeText: string): string | null {
  // حذف خطوط جدید، فضاهای اضافی و متن حقوق
  const cleaned = jobTypeText
    .replace(/\n/g, " ") // جایگزینی خطوط جدید با فاصله
    .replace(/\s+/g, " ") // تبدیل چندین فاصله به یک فاصله
    .replace(/\(.*?\)/g, "") // حذف هر چیزی داخل پرانتز (مثل حقوق)
    .trim(); // حذف فضاهای ابتدا و انتها

  return cleaned || null;
}

export default async function getJobinjaAll(
  keyword: string = "js"
): Promise<JobItem[] | null> {
  const items: JobItem[] = [];

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  try {
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );
    await page.goto(searchUrl(keyword, "jobinja"), {
      waitUntil: "networkidle2",
      timeout: 0,
    });
    // Handle lazyLoad(if exist)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const html = await page.content();
    const $ = cheerio.load(html);

    $(".c-jobListView__list .c-jobListView__item").each((i, element) => {
      const item: JobItem = {
        url: $(element).find(".c-jobListView__titleLink").attr("href") || "",
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
            .trim() || "Unknown",
        location:
          $(element)
            .find(".c-jobListView__metaItem")
            .eq(1)
            .find("span")
            .text()
            .trim() || "Unknown",
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

      if (item.url && item.title) {
        items.push(item);
      }
    });
  } catch (error) {
    console.error("Error scraping Jobinja:");
    console.error(error);
    return [];
  } finally {
    await browser.close();
  }

  if (items.length === 0) return null;
  return items;
}
