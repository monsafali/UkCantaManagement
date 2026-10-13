import puppeteer from "puppeteer";
import { existsSync } from "node:fs";

const configuredBrowser = process.env.PUPPETEER_EXECUTABLE_PATH;
const executablePath = configuredBrowser && existsSync(configuredBrowser)
  ? configuredBrowser
  : puppeteer.executablePath();

export const puppeteerConfig = {
  headless: true,
  executablePath,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
};
