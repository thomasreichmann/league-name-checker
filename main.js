if (process.env.NODE_ENV != 'production') {
    require('dotenv').config();
    console.log(`Dev mode`)
}

const {
    Kayn,
    REGIONS
} = require('kayn')
const api = Kayn(process.env.LEAGUE_API_KEY)({
    region: REGIONS.BRAZIL
})

// Divide a env var NAMES em um array com um nome em casa string
// Assumindo que os nomes nao contem "," e sao separados com ","
const names = process.env.NAMES.split(',')

// sendStart()

var schedule = require('node-schedule');

let j = schedule.scheduleJob('3 * * * * *', () => run(names))

console.log('Started')

function run(names) {
    for(name of names) {
        checkName(name)
    }
}

function checkName(name) {
    console.log(`Name checked at: ${Date.now()}`)
    api.Summoner.by.name(name)
        .then((summoner) => {
            console.log(`checked name ${summoner.name}`)
        })
        .catch(err => {
            if (err.statusCode == 404) {
                console.log(`Jogador "${name}" encontrado, Nome disponivel, mandando email`);
                sendAlert(name)
            }
        })
}

async function sendAlert(name) {
    const nodemailer = require('nodemailer');

    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    let info = await transporter.sendMail({
        from: '"Auto Checker" <thomasarojsdfskdfn@gmail.com>',
        to: 'thomasarojsdfskdfn@gmail.com',
        subject: `Nome ${name} disponivel`,
        text: `Nome ${name} disponivel`
    });

    console.log('Message sent: %s', info.messageId);

    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}

async function sendStart() {
    const nodemailer = require('nodemailer');

    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    try {
        let info = await transporter.sendMail({
            from: '"Auto Checker" <thomasarojsdfskdfn@gmail.com>',
            to: 'thomasarojsdfskdfn@gmail.com',
            subject: 'Testando name-checker email',
            text: 'Teste'
        });

        console.log('Message sent: %s', info.messageId);

        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } catch (e) {
        console.error(e)
    }
}