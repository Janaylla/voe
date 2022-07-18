const dotenv = require("dotenv")

var express = require("express");

dotenv.config();

var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");

// MongoDB
var mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});
var db = mongoose.connection;

// Express
var app = express();
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use("/availability", require("./routes/availabilityRoute"));
app.use("/reserve", require("./routes/reservationRouter"));

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", _ => {
  console.log("Conectado com o banco");
});



// sendMail({
//   to: "janayllaf@gmail.com",
//   from: "janayllaf@gmail.com",
//   subject: "Confirmação de cadastro no sistema",
//   text: "Parabéns, você acaba de se registrar no sistema Voe Dio",
// });
// console.log(sendMail)
// sendMail()

module.exports = app;