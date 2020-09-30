const Bot = require('./Bot')

const run = async () => {
    const bot = new Bot()

    await bot.initPuppeteer().then(() => console.log('Browser launched'))
    await bot.accessToInsta().then(() => console.log('Connection to Instagram done'))
    await bot.hashtagSearch().then(() => console.log('Hashtag entered'))
}

run()