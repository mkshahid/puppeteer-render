const puppeteer = require("puppeteer");
require("dotenv").config();

const scrapeLogic = async (res) => {
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });
  try {
    const page = await browser.newPage();
    const teamName = "Los Angeles Clippers";

    await page.goto("https://www.basketball-reference.com/boxscores/202404140LAC.html", { waitUntil: "networkidle2" });

    const data = await page.evaluate(() => {
      const teamNames = Array.from(document.querySelectorAll('.media-item')).map(x => x.nextElementSibling.textContent);
      const scores = Array.from(document.querySelectorAll('.score')).map(x => x.textContent);
  
      // let table = [];
      // let headers, body;
  
      // if (teamNames[0] === teamName) {
      //   headers = Array.from(document.querySelectorAll("table:has(caption:contains('Basic and Advanced Stats Table')):first thead tr:eq(1) th")).map(x => x.textContent);
      //   body = Array.from(document.querySelectorAll("table:has(caption:contains('Basic and Advanced Stats Table')):first tbody tr")).map(tr => Array.from(tr.querySelectorAll('td, th')).map(td => td.textContent));
      // } else {
      //   headers = Array.from(document.querySelectorAll("table:has(caption:contains('Basic and Advanced Stats Table')):gt(0) thead tr:eq(1) th")).map(x => x.textContent);
      //   body = Array.from(document.querySelectorAll("table:has(caption:contains('Basic and Advanced Stats Table')):gt(0) tbody tr")).map(tr => Array.from(tr.querySelectorAll('td, th')).map(td => td.textContent));
      // }
  
      // table.push(headers);
      // body.forEach(row => {
      //   while (row.length < headers.length) {
      //     row.push('');
      //   }
      //   table.push(row);
      // });
  
      return { teamNames, scores };
    });
    const logStatement = data.teamNames[0] + "-" + data.teamNames[1];
    res.send(logStatement);
  } catch (e) {
    console.error(e);
    res.send(`Something went wrong while running Puppeteer: ${e}`);
  } finally {
    await browser.close();
  }
};

module.exports = { scrapeLogic };
