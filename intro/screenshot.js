const puppeteer = require('puppeteer')
// const device = require('puppeteer/DeviceDescriptors')

const getScreenshot = async() => {
    const browser = await puppeteer.launch({
        headless: false,
        args: [`--window-size=${1920},${1080}`]
    });

    const page = await browser.newPage();
    await page.setViewport({width:1920, height:1080})

    await page.goto("https://www.reddit.com/", {waitUntil: 'domcontentloaded'});
    await page.waitForSelector('body')
    await page.screenshot({
        path: "screenshot.png",
        fullPage:true
    })
    await browser.close()
}

getScreenshot();


const url = process.argv[2]