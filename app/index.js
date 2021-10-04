require('dotenv').config();


const { Telegraf } = require('telegraf');

const bot = new Telegraf(`${process.env.BOT_ACCESS_TOKEN}`);

const express = require('express')
const dbConnection = require('../infra/database')
const app = express()

const baseVersion = "/api"

app.get('/', function (req, res) {
    res.send('Planting Statistic')
})

function timestamp() {
    return new Date()
}

app.get(baseVersion + '/watering/value/:value', async function (req, res) {
    const moisture = parseInt(req.params.value)
    const data = { timestamp: timestamp(), moisture }

    sendAlert(`[Alert] Watering ☀️ !`, moisture)

    dbConnection.query(`INSERT INTO watering set ?`, data, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");

        res.send(200, data)
    });
})

app.get(baseVersion + '/moisture/value/:value', async function (req, res) {
    const moisture = parseInt(req.params.value)
    const data = { timestamp: timestamp(), moisture }

    sendAlert(`[Alert] Current Moisture 🌱 `, moisture)

    dbConnection.query(`INSERT INTO moisture set ?`, data, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        res.send(200, data)
    });
})

async function sendAlert(message, moisture) {
    if (moisture > 50) {
        return
    }

    bot.telegram.sendMessage(process.env.CHAT_ID, `${message} ( Moisture : ${moisture} )`, {})
}

bot.command('current', ctx => {
    dbConnection.query(`SELECT timestamp, moisture FROM moisture ORDER BY timestamp desc limit 1`, function (err, result) {
        if (err) throw err;
        console.log("1 record get");

        if (result && result.length > 0) {
            const { timestamp, moisture } = result[0]
            bot.telegram.sendMessage(process.env.CHAT_ID, `⏲️ Timestamp: ${new Date(timestamp).toLocaleString()}  \n ☘️ Moisture : ${moisture}`, {})
        } else {
            bot.telegram.sendMessage(process.env.CHAT_ID, `🔥 No current value`, {})
        }
    });
})

bot.launch();

app.listen(process.env.PORT, () => {
    console.log(`Start App on Port: ${process.env.PORT}`)
})
