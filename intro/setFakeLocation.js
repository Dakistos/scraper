const puppeteer = require('puppeteer')

const setFakeLocation = async() => {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo:100
    })

    const screenshotPath = "location.png";
    let url = "https://www.google.fr/maps";
    const context = browser.defaultBrowserContext()
    await context.overridePermissions(url, ['geolocation'])

    const page = await browser.newPage()

    await page.evaluateOnNewDocument(() => {
        navigator.geolocation.getCurrentPosition = function(cb){
            setTimeout(() => {
                cb({
                    'coords':{
                        accuracy:21,
                        altitude:null,
                        altitudeAccuracy:null,
                        heading:null,
                        latitude:34.052235,
                        longitude:-118.243683,
                        speed:null
                    }
                })
            },1000)
        }
    });

    await page.goto(url,{waitUntil:'domcontentloaded'})
    let closeModelBtn = await page.$$('#introAgreeButton')
    await closeModelBtn.click()
    // await page.click('//*[@id="yDmH0d"]/c-wiz/div[2]/div/div/div/div/div[2]/div/a/span/span')
    // await page.setViewport({width:1920,height:1080})
    await page.screenshot({path:screenshotPath})

    // await browser.close()
}

setFakeLocation()