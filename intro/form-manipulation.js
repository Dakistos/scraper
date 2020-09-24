const puppeteer = require('puppeteer')

const sendMail = async() => {
    const browser = await puppeteer.launch({headless:false, slowMo:100});
    const page = await browser.newPage();

    await page.goto("https://keiturna.fr/", {waitUntil: "networkidle2"});

    await page.focus('#name')
    await page.keyboard.type('PuppeteerBot')

    await page.focus('#email')
    await page.keyboard.type('PuppeteerBot@mail.com')

    await page.focus('.contact-form > div:nth-child(7) > div:nth-child(2) > textarea:nth-child(1)')
    await page.keyboard.type('Coucou je rentre du texte')

    await browser.close()
}

sendMail()