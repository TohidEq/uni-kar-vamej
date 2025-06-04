import * as cheerio from "cheerio";
import { searchUrl } from "@/lib/searchUrl";
import { parseSalary } from "@/lib/parseSalary";
import { Page } from "puppeteer";

export default async function getPonishaAll(
  keyword: string,
  page: Page
): Promise<FreelancerItem[] | null> {
  const items: FreelancerItem[] = [];

  try {
    await page.goto(searchUrl(keyword, "ponisha"), {
      waitUntil: "domcontentloaded", //DONE
      timeout: 0,
      // timeout: 15000,
    });

    // Get the rendered HTML
    const html = await page.content();
    const $ = cheerio.load(html);

    // Ponisha typically uses a project card structure; adjust selector based on inspection
    $(".css-4obuzx>.breakpoint").each((i, element) => {
      const item: FreelancerItem = {
        type: "ponisha",
        url: `https://ponisha.ir${$(element)
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
        id: `https://ponisha.ir${$(element).find("a.css-f8mog2").attr("href")}`,
      };

      // Ensure required fields are present
      if (item.url && item.salary) {
        items.push(item);
      }
    });
  } catch (error) {
    console.error("Error scraping Ponisha:");
    console.error(error);
  }

  return items.length > 0 ? items : null;
}
