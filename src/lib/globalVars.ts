import puppeteer from "puppeteer";

export const ALL_SITES = {
  freelancer: ["karlancer", "punisha"],
  job: ["jobinja", "jobvision"],
};

export const getBrowser = async () => {
  try {
    const args = [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage", // بسیار مهم برای داکر
      "--disable-gpu", // مهم برای داکر و محیط‌های headless
      "--no-first-run",
      "--disable-extensions",
      "--disable-default-apps",
      "--disable-translate",
      "--disable-background-networking",
      "--disable-sync",
      "--mute-audio",
      "--hide-scrollbars",
      // گزینه‌های بیشتر برای بررسی:
      // '--single-process', // با احتیاط شدید استفاده شود، می‌تواند پایداری را کاهش دهد
      // '--no-zygote', // می‌تواند مصرف حافظه را در برخی سناریوها کاهش دهد اما ممکن است ایجاد تب جدید را کندتر کند
    ];
    console.log("Puppeteer cache dir:", process.env.PUPPETEER_CACHE_DIR);
    console.log(
      "Puppeteer executable path:",
      process.env.PUPPETEER_EXECUTABLE_PATH
    );
    console.log("Launching browser with args:", args);

    const browser = await puppeteer.launch({
      args: args,
      headless: true, // false برای دیباگ
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    });
    console.log("Browser launched successfully");
    return browser;
  } catch (error) {
    console.error("Failed to launch the browser:", error);
    throw error;
  }
};
