import puppeteer from "puppeteer";
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const browser = await puppeteer.launch({
    headless: false,
});
const page = await browser.newPage();

await page.goto("https://www.switchlight.beeble.ai/editor?image-type=material");

let skipButton = await page.waitForSelector(".jsx-34085734934cf5bf button:nth-child(2)");
await skipButton.click();

let fileInput = await page.waitForSelector("#file-selection-main-input");
await fileInput.uploadFile(path.join(__dirname, "input.jpg"));

/*let keepCurrentPlanButton = await page.waitForSelector("#keep-current-plan-button");
await keepCurrentPlanButton.click();*/

let outputImage = await page.waitForSelector("#preview-container img");
//await outputImage.screenshot({ path: path.join(__dirname, "output.jpg") });


await page.evaluate(`
    let canvas = document.createElement("canvas");
    canvas.width = document.querySelector("#preview-container img").naturalWidth;
    canvas.height = document.querySelector("#preview-container img").naturalHeight;
    let ctx = canvas.getContext("2d");
    ctx.drawImage(document.querySelector("#preview-container img"), 0, 0);
`);
let outputDataURL = await outputImage.evaluate(`
    canvas.toDataURL("image/png");
`);

let buff = Buffer.from(outputDataURL.split(",")[1], "base64");

writeFileSync(path.join(__dirname, "output.png"), buff);

await browser.close();