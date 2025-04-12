import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import { searchUrl } from "@/lib/searchUrl";
import { parseSalary } from "@/lib/parseSalary";
import Chromium from "@sparticuz/chromium-min";
import { remoteExecutablePath } from "@/lib/globalVars";



async function getKarlancerAll(
  keyword: string
): Promise<FreelancerItem[] | null> {
  // Array to store freelancer items
  const freelancerItems: FreelancerItem[] = [];
  const browser = await puppeteer.launch({
    headless: true,
    args: Chromium.args,
    executablePath: await Chromium.executablePath(remoteExecutablePath),
  });

  try {
    // Launch headless browser
    const page = await browser.newPage();
    await page.goto(searchUrl(keyword, "karlancer"), {
      waitUntil: "load",
      timeout: 0,
    });

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
            .trim() || "ناشناخته",
      };

      // Only add if required fields (url, title, salary, owner) are present
      if (item.title) {
        freelancerItems.push(item);
      }
    });

    // Close the browser
    await browser.close();
  } catch (error) {
    console.error("Error scraping Karlancer:");
    console.error(error);
  } finally {
    await browser.close();
  }

  if (freelancerItems.length === 0) return null;
  return freelancerItems;
}

export default getKarlancerAll;
