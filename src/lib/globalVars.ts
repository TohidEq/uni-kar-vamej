import puppeteer from "puppeteer";

export const ALL_SITES = {
  freelancer: ["karlancer", "punisha"],
  job: ["jobinja", "jobvision"],
};

export const getBrowser = async () => {
  try {
    console.log("Puppeteer cache dir:", process.env.PUPPETEER_CACHE_DIR);
    console.log(
      "Puppeteer executable path:",
      process.env.PUPPETEER_EXECUTABLE_PATH
    );
    console.log("Launching browser with args:", [
      "--no-sandbox",
      "--disable-setuid-sandbox",
    ]);

    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    });
    console.log("Browser launched successfully");
    return browser;
  } catch (error) {
    console.error("Failed to launch the browser:", error);
    throw error;
  }
};
