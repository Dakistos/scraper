class InstagramBot {
//raphael.morin95gmail.com
    constructor() {
        this.firebase = require('./firebase_db')
        this.config = require('./config/puppeteer.json')
    }

    // Initialiser puppeteer et lancer le navigateur
    async initPuppeteer() {
        const puppeteer = require('puppeteer')
        this.browser = await puppeteer.launch({
            headless: this.config.settings.headless
        });
        this.page = await this.browser.newPage()
        await this.page.setViewport({width: 1500, height: 764})
    }

    // Instructions pour se connecter à Instagram
    async accessToInsta() {
        await this.page.goto(this.config.base_url)
        await this.page.waitForTimeout(2500)

        // Username et mot de passe
        await this.page.click(this.config.selectors.username_field)
        await this.page.keyboard.type(this.config.username)
        await this.page.click(this.config.selectors.password_field)
        await this.page.keyboard.type(this.config.password)

        // Bouton connexion
        await this.page.click(this.config.selectors.login_button)
    }

    async hashtagSearch() {
        await this.page.waitForTimeout(3000)
        const hashtagToSearch = this.config.searchHashtag

        // Boucle sur le tableau de hashtag
        for (let i = 0; i < hashtagToSearch.length; i++) {
            const searchUrl = `https://www.instagram.com/explore/tags/${hashtagToSearch[i]}/`
            await this.page.goto(searchUrl)

            // Double boucle pour sélectionner les différents posts via les nth-child
            for (let j = 1; j < 4; j++) {
                for (let r = 1; r < 4; r++) {

                    await this.page.click(`#react-root > section > main > article > div > div > div > div:nth-child(${j}) > div:nth-child(${r}) > a`)
                    await this.page.waitForTimeout(2500)

                    let usernameSelector = this.config.selectors.list_username
                    let followSelector = this.config.selectors.follow_button
                    let likeSelector = this.config.selectors.like_button

                    let users = [];

                    // Récupération du nom d'utilisateur du post
                    let username = await this.page.evaluate(x => {
                        let element = document.querySelector(x);
                        return Promise.resolve(element ? element.innerHTML : '');
                    }, usernameSelector);

                    // Récupération du statut (follow ou pas follow)
                    let followStatus = await this.page.evaluate(x => {
                        let status = document.querySelector(x)
                        return Promise.resolve(status ? status.innerHTML : '')
                    }, followSelector)

                    // Récupération de l'état like ou pas like du post
                    let likeStatus = await this.page.evaluate(x => {
                        let like = document.querySelector(x).getAttribute('fill')
                        return Promise.resolve(like ? like : '')
                    }, likeSelector)

                    await this.page.waitForTimeout(1500)

                    // Si followstatus = follow ou s'abonner, on clique sur s'abonner
                    if(followStatus === 'Follow' || followStatus === "S’abonner"){
                        await this.page.click(this.config.selectors.follow_button)
                        users[`name`] = username
                        await this.firebase.followedUserData(users)
                    }

                    // Si l'image like n'est pas de couleur rouge, on clique sur like
                    if (likeStatus !== "#ed4956") {
                        await this.page.click(this.config.selectors.like_button)
                    }

                    // On ferme le post et attend un peu
                    await this.page.click(this.config.selectors.close_post)
                    await this.page.waitForTimeout(2000)
                }
            }
        }
        await this.browser.close()
    }
}

module.exports = InstagramBot