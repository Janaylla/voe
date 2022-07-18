const e = require("express")
const express = require("express")
const router = express.Router()

const Day = require("../model/day").model

router.post("/", function (req, res, next) {
    console.log("Request attempted")
    try {
        const dateTime = new Date(req.body.date)
        Day.find(({ date: dateTime }, (err, docs) => {
            if (err) {
                throw new Error("Não foram encontrados dados para data")
            }
            if (docs.length > 0) {
                res.status(200).send(docs[0])

            }
            else {
                const allTables = require("../data/allTables")
                const day = new Day({
                    date: dateTime,
                    tables: allTables
                })
                day.save(err => {
                    if (err) {
                        throw new Error("Error saving date and time")
                    }
                    Day.find({ date: dateTime }, (err, docs) => {
                        if (err) {
                            throw new Error("Not find date created")
                        }
                        res.status(200).send(docs[0])
                    })

                })
            }

        }))
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).send(error.message)
        } else {
            res.status(500).send("Unexpected error ")
        }

    }


})

module.exports = router