/* eslint-disable @typescript-eslint/no-unused-vars */
import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import { NextResponse } from "next/server";
import { searchUrl } from "@/lib/searchUrl";
import { parseSalary } from "@/lib/parseSalary";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getPunishaAll(
  keyword: string
): Promise<FreelancerItem[] | null> {
  const items: FreelancerItem[] = [];

  const browser = await puppeteer.launch({ headless: true });
  try {
    // Launch headless browser
    const page = await browser.newPage();
    await page.goto(searchUrl(keyword, "punisha"), {
      waitUntil: "load",
      timeout: 0,
    });

    // Get the rendered HTML
    const html = await page.content();
    const $ = cheerio.load(html);

    // Ponisha typically uses a project card structure; adjust selector based on inspection
    $(".css-4obuzx>.breakpoint").each((i, element) => {
      const item: FreelancerItem = {
        type: "punisha",
        url: `https://ponisha.ir/${$(element)
          .find("a.css-f8mog2")
          .attr("href")}`,
        title: $(element).find(".MuiTypography-h4.css-1lu0tb8").text().trim(),
        caption:
          $(element)
            .find(".MuiTypography-root.MuiTypography-subtitle1")
            .text()
            .trim() || null,
        salary: parseSalary(
          $(element)
            .find(".MuiTypography-subtitle2.css-1w3e4hl .value")
            .last()
            .text()
            .trim()
        ),
        image: null, // No image in the provided HTML
        time:
          $(element)
            .find(".MuiTypography-subtitle2.css-13y4j3s")
            .first()
            .find(".value")
            .text()
            .trim() || null,
        owner: "ناشناخته",
      };

      // Ensure required fields are present
      if (item.url && item.salary) {
        items.push(item);
      }
    });
  } catch (error: unknown) {
    console.error("Error scraping Ponisha:");
    console.error(error);
  } finally {
    await browser.close();
  }
  if (items.length === 0) return null;

  return items;
}

export default getPunishaAll;
