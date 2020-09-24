const puppeteer = require('puppeteer')

function run(pagesToScrape = 1){
    return new Promise(async(resolve, reject)=> {
        try {

            const browser = await puppeteer.launch({headless:false})
            const page = await browser.newPage()
            await page.goto('http://books.toscrape.com')

            let currentPage = 1
            let urls = []

            // while currentPage < pagetoscrap, encapsulate evaluate and get all urls
            while(currentPage <= pagesToScrape) {
                let newUrls = await page.evaluate(() => {
                    let results = [];
                    let items = document.querySelectorAll('article.product_pod')
                    items.forEach((item) => {
                        results.push({
                            title: item.querySelector('h3 a').getAttribute('title'),
                            price: item.querySelector('p.price_color').innerHTML,
                            url: item.querySelector('h3 a').getAttribute('href')
                        });
                    });
                    return results
                });
                urls = urls.concat(newUrls);
                if(currentPage < pagesToScrape) {
                    await Promise.all([
                        // Add click function to access the "more" button
                        await page.click('#default > div > div > div > div > section > div:nth-child(2) > div > ul > li.next > a'),
                        // Search if a.storyLink is charged
                        await page.waitForSelector('#default > div > div > div > div > section > div:nth-child(2) > div > ul > li.next > a')
                    ])
                }
                currentPage++
            }
            // await browser.close()
            return resolve(urls)
        } catch(e){
            return reject(e)
        }
    })
}

run(5).then(console.log).catch(console.error)