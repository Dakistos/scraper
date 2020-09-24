const puppeteer = require('puppeteer')

const getData = async() => {
    const browser = await puppeteer.launch({
        headless: true,
    })

    // Naviguer vers le site
    let url = "http://books.toscrape.com"
    const page = await browser.newPage()
    await page.goto(url,{waitUntil:'domcontentloaded'})

    //Select all links in a h3 tag
    const hrefs = await page.$$eval('h3 a',
        as => as.map(a => a.href));

    const book = hrefs[Math.floor(Math.random() * hrefs.length)];
    //Cliquer sur le lien et récupérer le prix et le titre du livre puis les afficher dans la console
    // await page.click('#default > div > div > div > div > section > div:nth-child(2) > ol > li:nth-child(1) > article > div.image_container > a')
    await page.goto(book, {waitUntil:'domcontentloaded'})

    const result = await page.evaluate(() => {
        let title = document.querySelector('#content_inner > article > div.row > div.col-sm-6.product_main > h1').innerText
        let price = document.querySelector('#content_inner > article > div.row > div.col-sm-6.product_main > p.price_color').innerText
        return {title, price}
    })

    console.log(result)
    await browser.close()
}

getData()