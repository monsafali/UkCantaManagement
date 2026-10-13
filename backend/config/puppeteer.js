import puppeteer from "puppeteer";

export const puppeteerConfig = {
  headless: true,
  executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || puppeteer.executablePath(),
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
};
