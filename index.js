
const fs = require('fs')
const { Client, MessageMedia } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')
const rmeme = require('rmeme')
const oneLinerJoke = require('one-liner-joke')
const insultCompliment = require('insult-compliment')
const nineGag = require('9gag')
const Scrapper = nineGag.Scraper
const Downloader = nineGag.Downloader

const PREFIX = '-'

const diceArray = ["One!", "Two!", "Three!", "Four!", "Five!", "Six!!!"]
const diceAudio = './assets/dice.wav'

const tossArray = ["Head!", "Tail!"]
const coinAudio = './assets/toss.mp3'

//path where the session data will be stored
const SESSION_FILE_PATH = './session.json'

//load the session data if it has been previously saved
let sessionData
if(fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = require(SESSION_FILE_PATH)
}

//use the saved data
const client = new Client({
    session: sessionData,
    puppeteer: {
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    }
})

//save session values to the file upon successfull auth
client.on('authenticated', session => {
    sessionData = session
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (error) => {
        if(error) console.log(error)
    })
})

client.on('qr', qr => {
    qrcode.generate(qr, {small: true})
})

client.on('message', async (msg) => {
    if(msg.body.startsWith(PREFIX)) {
        const [CMD_NAME, ...args] = msg.body
            .trim()
            .substring(PREFIX.length)
            .split(/\s+/)
        if(CMD_NAME === 'help') msg.reply(`Random Chats\n-help1\n\nMemes and gags\n-help2\n\nGames\n-help3\n\nMedia\n-help4\n\nMusic\n-help5`)
        else if(CMD_NAME === 'help1') {
            msg.reply(`Ping me\n-hey\n\nKnow me\n-intro\n\nGet some love\n-love\n\nGet a joke\n-joke\n\nroast someone\n-roast <name>\n\ncompliment someone\n-compliment <name>`)
        }
        else if(CMD_NAME === 'hey') msg.reply(`Hi ${msg.author}, how have you been?`)
        else if(CMD_NAME === 'intro') msg.reply('Hello there! My name is Ayesha and I am a Chat-Bot designed and developed by Mishor. I hope we will get along well 😊 \n Reply with "-help" to get all the commands ')
        else if(CMD_NAME === 'love') msg.reply(`I really love you ${msg.author} and I mean it`)
        else if(CMD_NAME === 'joke') {
            var joke = oneLinerJoke.getRandomJoke()
            msg.reply(joke.body)
        }
        else if(CMD_NAME === 'roast') {
            if(args.length == 0) {
                msg.reply('No mentions found')
            }
            else {
                args.map(member => {
                    var insult = insultCompliment.Insult()
                    console.log(insult)
                    msg.reply(`hey ${member}, ${insult}`)
                })
            }
        }
        else if(CMD_NAME === 'compliment') {
            if(args.length == 0) {
                msg.reply('No mentions found')
            }
            else {
                args.map(member => {
                    var compliment = insultCompliment.Compliment()
                    msg.reply(`hey ${member}, ${compliment}`)
                })
            }
        }
        else if(CMD_NAME === 'help2') {
            msg.reply('Get a random meme😂\n-meme\n\nGet a random gag🥴\n\n-gag')
        }
        else if(CMD_NAME === 'meme') {
            const imageUrl = await rmeme.meme()
            const memeImage = await MessageMedia.fromUrl(imageUrl)
            client.sendMessage(msg.from, msg.reply(memeImage))
        }
        else if(CMD_NAME === 'gag') {
            try {
                const scrapper = new Scrapper()
                const post = await scrapper.scrap()
                console.log(post[0].content)
                const gagVideo = await MessageMedia.fromUrl(post[0].content)
                client.sendMessage(msg.from, msg.reply(gagVideo))
            } catch(error) {
                console.log('Error while getting a gag ', error)
            }
        }
        else if(CMD_NAME === 'help3') {
            msg.reply('throw a dice🎲\n-dice\n\ntoss a coin💰\n-toss\n\nhug🤗\n-hug <name>\n\nkiss😘\n-kiss <name>\n\nslap👋\n-slap <name>\n\nkick🦶\n-kick <name>')
        }
        else if(CMD_NAME === 'dice') {
            let outcome = diceArray[Math.floor(Math.random()*diceArray.length)];
            const sound = MessageMedia.fromFilePath(diceAudio)
            client.sendMessage(sound)
            msg.reply(`It's a ${outcome}`)
        }
        else if(CMD_NAME === 'toss') {
            let outcome = tossArray[Math.floor(Math.random()*tossArray.length)]
            const sound = MessageMedia.fromFilePath(coinAudio)
            client.sendMessage(sound)
            msg.reply(`It's a ${outcome}`)
        }
        else if(CMD_NAME === 'hug') {

        }
        else if(CMD_NAME === 'help4') {
            msg.reply('These are under developement. Sorry for the inconvenience 😞')
        }
        else if(CMD_NAME === 'help5') {
            msg.reply('These are under developement. Sorry for the inconvenience 😞')
        }
        else {
            msg.reply('this command is not listed stupid 😑. reply with -help to get all commands')
        }
        
    }

})

client.on('ready', () => {
    console.log('bot is ready')
})

client.initialize()