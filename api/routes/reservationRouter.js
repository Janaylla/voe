const express = require("express");
const { sendMail } = require("../util/sendEmail");
const router = express.Router()

const Day = require("../model/day").model
const Reservation = require("../model/reservation").model;

router.post("/", function (req, res) {
    console.log("Request attempted")
    try {

        const dateTime = new Date(req.body.date)
        Day.find(({ date: dateTime }, (err, days) => {
            if (err) {
                throw new Error("Day not found")
            }
            if (!days.length) {
                throw new Error("Day not found")
            }
            let day = days[0]
            day.tables.forEach(table => {
                if (table._id == req.body.table) {
                    const { name,
                        phone,
                        email,
                        reservedSeats } = req.body
                    const reservation = new Reservation({
                        name,
                        phone,
                        email,
                        reservedSeats: reservedSeats ? reservedSeats : 1,
                        cancel: false
                    })

                    table.reservations.push(reservation)

                    table.isAvailable = false
                    day.save((err) => {

                        if (err) {
                            throw new Error("Reserved not saved")
                        }
                        sendMail({
                            name,
                            phone,
                            email
                        }, {
                            name: table.name,
                            local: table.location,
                            day: new Date(day.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' }),
                            hours: "00:00h"
                        })

                        res.status(200).send("Reserved")

                    })
                }
            });


        }))
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).send(error.message)
        } else {
            res.status(500).send("Unexpected error ")
        }

    }
})
router.get("/:email", function (req, res) {
    try {

        const daysReservation = []
        Day.find(({}, (err, days) => {
            if (err) {
                throw new Error("Day not found")
            }
            for (const day of days) {
                for (const table of day.tables) {
                    const myTables = []
                    for (const reservation of table.reservations) {
                        if (reservation.email === req.params.email) {
                            myTables.push(reservation)
                        }
                    }
                    if (myTables.length) {
                        daysReservation.push({ ...table._doc, reservations: myTables, day: day.date })
                    }
                }
            }
            res.send(daysReservation)

        }))
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).send(error.message)
        } else {
            res.status(500).send("Unexpected error ")
        }
    }

})
router.patch("/cancel", function (req, res) {
    try {

        Day.find(({ date: req.body.date }, (err, days) => {
            // console.log(days)
            if (err) {
                   throw new Error("Day not found")
            }
                if (days.length > 0) {
                    let day = days[0]
                    // console.log("day", day.tables)
    
                    day.tables.forEach(table => {
                        if (table._id == req.body.table) {
                            table.reservations.forEach((reservation) => {
                                if (reservation._id == req.body.reservation) {
                                    reservation.cancel = true
                                    day.save((err) => {
                                        if (err) {
                                            console.log(err)
                                        } else {
                                            console.log("Reserved")
                                            sendMail({
                                                name: reservation.name,
                                                phone: reservation.phone,
                                                email: reservation.email
                                            }, {
                                                name: table.name,
                                                local: table.location,
                                                day: new Date(day.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' }),
                                                hours: "00:00h"
                                            }, true)
    
                                            res.status(200).send("Reserved")
                                        }
                                    })
                                }
                            })
                        }
                    });
                }
           
        }))
    }catch(error){
        if (error instanceof Error) {
            res.status(400).send(error.message)
        } else {
            res.status(500).send("Unexpected error ")
        }
    }
})

module.exports = router 