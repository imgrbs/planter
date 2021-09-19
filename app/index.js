require('dotenv').config();

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

app.get(baseVersion + '/watering', function (req, res) {
    const data = { timestamp: timestamp(), moisture: parseInt(req.query.value) }

    dbConnection.query(`INSERT INTO watering set ?`, data, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");

        res.send(200, data)
    });
})

app.get(baseVersion + '/moisture', function (req, res) {
    const data = { timestamp: timestamp(), moisture: parseInt(req.query.value) }

    dbConnection.query(`INSERT INTO moisture set ?`, data, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        res.send(200, data)
    });
})

app.listen(process.env.PORT, () => {
    console.log(`Start App on Port: ${process.env.PORT}`)
})
