class GithubBot {

    constructor() {
        this.firebase = require('./firebase_db');
        this.config = require('./config/puppeteer.json')
    }

    async initPuppeteer(){
        const puppeteer = require('puppeteer')
        this.browser = await puppeteer.launch({
            headless: this.config.settings.headless
        });
        this.page = await this.browser.newPage()
        await this.page.setViewport({width:1500, height:764})
    }

    async visitGithub(){
        await this.page.goto(this.config.base_url)
        await this.page.waitForTimeout(2500)
        await this.page.click(this.config.selectors.home_to_login_button)
        await this.page.waitForTimeout(2500)

        await this.page.click(this.config.selectors.username_field)
        await this.page.keyboard.type(this.config.username)

        await this.page.click(this.config.selectors.password_field)
        await this.page.keyboard.type(this.config.password)

        await this.page.click(this.config.selectors.login_button)
    }

    async parseUsername() {
        await this.page.waitForTimeout(2000)
        const userToSearch = this.config.searchUsername
        const searchUrl = `https://github.com/search?q=${userToSearch}&type=Users`

        await this.page.goto(searchUrl)
        await this.page.waitForTimeout(2000)

        let numPages = 1

        if (numPages > this.config.settings.max_amount_pages) {
            numPages = this.config.settings.max_amount_pages
        }

        for (let i = 1; i < numPages; i++ ) {
            let pageUrl = searchUrl + "&p=" + i
            await this.page.goto(pageUrl)

            let listLength = await this.page.evaluate((x) => {
                return document.getElementsByClassName(x).length
            }, this.config.selectors.length_selector);

            for ( let j = 1; j < listLength; j++ ) {
                let usernameSelector = this.config.selectors.list_username.replace('INDEX',i)
                let emailSelector = this.config.selectors.list_email.replace('INDEX',i)

                let username = await this.page.evaluate((x) => {
                    return document.querySelector(x).getAttribute('href').replace('/','')
                }, usernameSelector);

                let email = await this.page.evaluate((y) => {
                    let element = document.querySelector(y).getAttribute('href').replace('/','')
                    return element ? element.innerHTML : null
                }, emailSelector);
                if(!email)
                    continue
                console.log('Resultats', username, "-", email)
            }
        }
    }

    async numPages(page) {
        const num_user_selector = "js.pjax-container > div > div > div > div > h3"
        let inner = await page.evaluate((x) => {
            let html = document.querySelector(x).innerHTML

            return html.replace(',', '').replace('users', '').trim()
        }, num_user_selector)
    }
}

module.exports = GithubBot;