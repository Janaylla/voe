const Schema = require("mongoose").Schema
const mongoose = require("mongoose")

const reservationSchema = new Schema({
    name: String,
    phone: String,
    email: String,
    reservedSeats: Number,
    cancel: Boolean
})

const Reservation = mongoose.model("Reservation", reservationSchema)

module.exports.model = Reservation
module.exports.schema = reservationSchema