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

// sendStart()

var schedule = require('node-schedule');

let j = schedule.scheduleJob('3 * * * * *', () => checkName())
console.log('Started')

function checkName() {
    console.log(`Name checked at: ${Date.now()}`)
    api.Summoner.by.name('Thomas')
        .then((summoner) => {

        })
        .catch(err => {
            if (err.statusCode == 404) {
                console.log(`Jogador nao encontrado, Nome disponivel, mandando email`);
                sendAlert()
            }
        })
}

async function sendAlert() {
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
        subject: 'Nome disponivel',
        text: 'Nome thomas disponivel.'
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