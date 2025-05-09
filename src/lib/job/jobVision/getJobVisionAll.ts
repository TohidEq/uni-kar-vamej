import * as cheerio from "cheerio";
import { searchUrl } from "@/lib/searchUrl";

import { Page } from "puppeteer";

export default async function getJobvisionAll(
  keyword: string,
  page: Page
): Promise<JobItem[] | null> {
  const items: JobItem[] = [];

  try {
    await page.goto(searchUrl(keyword, "jobvision"), {
      waitUntil: "domcontentloaded", //DONE
      timeout: 0,
    });

    await page.waitForSelector("job-card span.d-flex.align-items-center", {
      visible: true,
      timeout: 10000,
    });

    const html = await page.content();
    const $ = cheerio.load(html);

    $("job-card").each((i, element) => {
      const salaryText =
        $(element).find(".font-size-12px").first().text().trim() || "0";

      const { starts: salaryStart, ends: salaryEnd } =
        parseSalaryRange(salaryText);
      const salary = salaryStart;

      // Extract job type from tags like "امکان دورکاری" or "امکان جذب کارآموز"
      const jobTypeRaw = $(element)
        .find(".filter-label .text-secondary")
        .text()
        .trim();

      const item: JobItem = {
        type: "jobvision",
        url: `https://jobvision.ir${$(element).find("a").attr("href") || ""}`,
        title: $(element).find(".job-card-title").text().trim() || "",
        caption: null, // No description in listing
        salary,
        salaryStart,
        salaryEnd,
        image: $(element).find("img").attr("src") || null,
        time:
          $(element)
            .find("span.d-flex.align-items-center")
            .first()
            .text()
            .trim() || null,
        owner:
          $(element).find("a.text-black.line-height-24").text().trim() ||
          "ناشناخته",
        location:
          $(element)
            .find(".text-secondary.pointer-events-none a")
            .first()
            .text()
            .trim() || null,
        jobType: cleanJobType(jobTypeRaw),
      };

      // Ensure required fields are present
      if (item.url && item.title !== "") {
        items.push(item);
      }
    });

    if (items.length === 0) {
      console.log("No items found. HTML snippet:", html.slice(0, 500));
    }
  } catch (error) {
    console.error("Error scraping Jobvision:");
    console.error(error);
  }
  return items.length > 0 ? items : null;
}

function parseSalaryRange(salaryText: string): {
  starts: number;
  ends: number;
} {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const englishDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  // تابع کمکی برای تبدیل اعداد پارسی به انگلیسی
  function toEnglishNumber(str: string): string {
    let result = str;
    for (let i = 0; i < persianDigits.length; i++) {
      result = result.replace(
        new RegExp(persianDigits[i], "g"),
        englishDigits[i]
      );
    }
    return result;
  }

  // حذف «تومان» و «میلیون» و تمیز کردن رشته
  const cleanedText = salaryText
    .replace(/تومان/g, "")
    .replace(/میلیون\s*/g, "")
    .replace(/[٬,]/g, "")
    .trim();

  // استخراج اعداد با regex
  const rangeMatch = cleanedText.match(/(\d+)\s*-\s*(\d+)/);
  if (rangeMatch) {
    const start = parseInt(toEnglishNumber(rangeMatch[1]), 10) * 1000000; // تبدیل به میلیون
    const end = parseInt(toEnglishNumber(rangeMatch[2]), 10) * 1000000;
    return { starts: start, ends: end };
  }

  // در صورت عدم تطابق، صفر برگردون
  return { starts: 0, ends: 0 };
}

function cleanJobType(jobTypeText: string): string | null {
  const cleaned = jobTypeText
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\(.*?\)/g, "")
    .trim();
  return cleaned || null;
}
