/* eslint-disable @typescript-eslint/no-unused-vars */
import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import { NextResponse } from "next/server";
import { searchUrl } from "@/lib/searchUrl";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getKarlancerAll(
  keyword: string
): Promise<FreelancerItem[] | null> {
  // Array to store freelancer items
  const freelancerItems: FreelancerItem[] = [];

  try {
    // Launch headless browser
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(searchUrl(keyword, "karlancer"));

    // Get the rendered HTML
    const html = await page.content();
    const $ = cheerio.load(html);

    // Target project cards (assuming 'app-sidebar-project-card' from your earlier example)
    $("app-sidebar-project-card").each((i, element) => {
      const item: FreelancerItem = {
        type: "karlancer",
        url: `https://www.karlancer.com${$(element)
          .find("a[applinktarget]")
          .attr("href")}`,
        title: $(element).find("h4.fs-18.font-weight-bold").text().trim(),
        caption:
          $(element)
            .find(".text-right.white-space-pre-line.lh-2-31.fs-13")
            .text()
            .trim() || null,
        salary: parseSalary(
          $(element)
            .find(".d-flex.align-items-center.mb-10 .fs-16.b-900")
            .first()
            .text()
            .trim()
        ),
        image: $(element).find("img").attr("src") || null, // Assuming an image might exist
        time: $(element).find(".fs-13.text-nowrap.br-90").text().trim() || null,
        owner:
          $(element)
            .find(".px-10.py-2px.fs-14.br-5.color-white.bg-acacac-color")
            .text()
            .trim() || "Unknown",
      };

      // Only add if required fields (url, title, salary, owner) are present
      if (item.title) {
        freelancerItems.push(item);
      }
    });

    // Output the results
    //console.log("r=========");
    //console.log(freelancerItems);
    //console.log(JSON.stringify(freelancerItems, null, 2));

    // Close the browser
    await browser.close();
  } catch (error: unknown) {
    console.error("Error scraping Karlancer:");
    console.error(error);
  }

  if (freelancerItems.length === 0) return null;
  return freelancerItems;
}

function parseSalary(persianString: string): number {
  // Map of Persian digits to English digits
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const englishDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  let cleanedString = persianString
    .replace(/تومان/g, "") // حذف "تومان"
    .replace(/,/g, ""); // حذف جداکننده هزارگان فارسی

  for (let i = 0; i < persianDigits.length; i++) {
    cleanedString = cleanedString.replace(
      new RegExp(persianDigits[i], "g"),
      englishDigits[i]
    );
  }

  return parseInt(cleanedString, 10);
}

export default getKarlancerAll;
