

import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Input,
} from "reactstrap";


// eslint-disable-next-line import/no-anonymous-default-export
export default _ => {
  const [totalTables, setTotalTables] = useState([]);

  // User's booking details
  const [booking, setBooking] = useState({
    email: "",
  });

  // Basic reservation "validation"
  const [reservationError, setReservationError] = useState(false);
  const validateEmail = (email) => {
    return email.match(
      /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+[^<>()\.,;:\s@\"]{2,})$/
    );
  };
  const getDate = (date) => {
    date = new Date(date)
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    const dateFormated =
      months[date.getMonth()] +
      " " +
      date.getDate() +
      " " +
      date.getFullYear();
    return dateFormated;
  };

  useEffect(() => {
    if (validateEmail(booking.email)) {
      setReservationError(false)
      getTables()
    } else {
      setReservationError("Email invalido")
      setTotalTables([])
    }
  }, [booking])

  async function cancel(date, table, reservation){
    try {
      await fetch(`http://localhost:3005/reserve/cancel`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          date, table, reservation
        })
      });
      getTables()
    } catch (error) {
      setReservationError("Unable to cancel reservation")
    }
  }
  async function getTables() {
    try {
      let res = await fetch(`http://localhost:3005/reserve/${booking.email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      console.log(res)
      res = await res.json();
      console.log(res)
      // Filter available tables with location and group size criteria
      let tables = res
      setTotalTables(tables);
    } catch (error) {
      setReservationError("Unable to find your reservations")
    }
  }
  return (
    <>
      <Row noGutters className="text-center align-items-center ">
        <Col>
          <p className="looking-for-seats-book">
            Procure suas reservas
          </p>

          {reservationError ? (
            <p className="reservation-error">
              {reservationError}
            </p>
          ) : null}
        </Col>
      </Row>


      <div id="confirm-reservation-stuff">
        <Row
          noGutters
          className="text-center justify-content-center reservation-details-container"
        >

          <Col xs="12" sm="3" className="reservation-details">
            <Input
              type="text"
              bsSize="lg"
              placeholder="Email"
              className="reservation-input"
              value={booking.email}
              onChange={e => {
                setBooking({
                  ...booking,
                  email: e.target.value
                });
              }}
            />
          </Col>
        </Row>
      </div>
      <Row className="my-reservations text-center ">
        {
          totalTables.map((table) => {
            return <Row className="my-reservation-table">
              <div className="table-name-location-day">
                <div className="table-name-location">
                  <p className="table-location">{table.name}</p>
                  <p className="table-location">{table.location}</p>
                </div>
                <p className="table-day">{getDate(table.day)}</p>
              </div>
              <div className="my-reservation-table-box-reservations">
                {
                  table.reservations.map((reser) => {
                    return <div className="my-reservation">
                      <div >
                        <p>
                          Nome: {reser.name}
                        </p>
                        <p>
                          Assentos reservados: {reser.reservedSeats}
                        </p>
                      </div>
                      <div className="my-reservation-status">
                        <p className={` ${!reser.cancel ? "active" : "cancel"}`}>
                          {reser.cancel ? "CANCELADA" : "ATIVA"}
                        </p>
                        {!reser.cancel && <span onClick={() => cancel(table.day, table._id, reser._id)}>
                          cancelar
                        </span>}
                      </div>
                    </div>

                  })
                }
              </div>
            </Row>
          })

        }
      </Row>

    </>
  );
};
