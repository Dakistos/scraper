const puppeteer = require('puppeteer')

// Function to go on URL and login
const connection = async(page) => {
    //Go to LDLC
    await page.goto("https://ldlc.com/", {waitUntil: "networkidle2"});

    // Go to connection page and wait selector "#Email" before typing
    await page.click('#account-menu-item')
    await page.waitFor(3000)
    await page.waitForSelector('#Email')
    console.log("Waiting...")

    // Handle form
    await page.focus('#Email')
    await page.keyboard.type('mathrogue50@gmail.com')
    await page.focus('#Password')
    await page.keyboard.type('Puppeteerisgood1')

    // Connection
    await page.click('body > div.main.identification > div > form > button')
    console.log("Connected!")
}

function run() {
    return new Promise(async(resolve, reject)=> {
        try {
            // Launch browser and open new tab
            const browser = await puppeteer.launch({headless: false, slowMo: 50});
            const page = await browser.newPage();
            await page.setViewport({ width: 1920, height: 1080 })
            await connection(page)

            // Search a product
            await page.waitForSelector('#search_search_text')
            await page.focus('#search_search_text')
            await page.keyboard.type('MSI RTX 2080')

            // Wait search-engine appears and click on first link
            await page.waitForSelector('.pdt-item')
            await page.click('.pdt-item a')

            // display technical sheet
            await page.waitForSelector('.detail')
            await page.click('body > div.main.product-detail > div.sbloc.details-pdt > div > div.nav-tabs-component.nav-tabs-component-grey > ul > li:nth-child(2) > h2 > a')

            let techs = []

            let details = await page.evaluate(() => {
                let results = []
                // let items = document.querySelectorAll("tbody");;
                // let count = 0;
                // for(let i =0; i<items.length;i++){
                //     count++
                // }
                const name = Array.from(document.querySelectorAll('tbody tr td.checkbox a'))
                let names = name.map(td => {
                    return td.textContent
                })

                let tds = Array.from(document.querySelectorAll('tbody'))
                let labels = tds.map(td => {
                    return td.innerHTML
                })


                return {name: names, label: labels}
                //  items.forEach(item => {
                //     // console.log(item)
                //     results.push({
                //         label: item.querySelector('tr td.label h3').innerHTML,
                //         // tr.feature:nth-child(1) > td:nth-child(2)
                //         // name: item.querySelector('tr td.checkbox a').innerHTML
                //         // tr.feature:nth-child(1) > td:nth-child(3)
                //     });
                // });
                //  return results
            });
            techs = techs.concat(details);

            return resolve(techs)
        } catch (e) {
            return reject(e)
        }
    });
}

run().then(console.log)