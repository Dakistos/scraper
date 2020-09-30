const Bot = require('./Bot')

const run = async () => {
    const bot = new Bot()

    await bot.initPuppeteer().then(() => console.log('Browser launched'))
    await bot.visitGithub().then(() => console.log('Connection to github successed'))
    await bot.parseUsername().then(() => console.log('Username parsed'))
}

run()