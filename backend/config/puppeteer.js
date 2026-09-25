export const puppeteerConfig = {
  headless: true,

 executablePath: "/usr/bin/google-chrome",
//  executablePath: "/data/data/com.termux/files/usr/bin/chromium-browser",

  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox"
  ]
};
