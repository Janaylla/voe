import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input,
  Button
} from "reactstrap";
import { goToTankYou } from "../route/coordinator";

import Table from "./table";

// eslint-disable-next-line import/no-anonymous-default-export
export default _ => {
  const navigate = useNavigate()
  const [totalTables, setTotalTables] = useState([]);

  // User's selections
  const [selection, setSelection] = useState({
    table: {
      name: null,
      id: null
    },
    date: new Date(),
    time: "9AM",
    location: "Local",
    size: 1
  });

  // User's booking details
  const [booking, setBooking] = useState({
    name: "",
    phone: "",
    email: ""
  });

  // List of potential locations
  const [locations] = useState(["Curitiba", "Patio", "Inside", "Bar"]);
  const [times] = useState([
    "9AM",
    "10AM",
    "11AM",
    "12PM",
    "1PM",
    "2PM",
    "3PM",
    "4PM",
    "5PM"
  ]);
  // Basic reservation "validation"
  const [reservationError, setReservationError] = useState(false);

  const getDate = _ => {
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
    const date =
      months[selection.date.getMonth()] +
      " " +
      selection.date.getDate() +
      " " +
      selection.date.getFullYear();
    let time = selection.time.slice(0, -2);
    time = selection.time > 12 ? time + 12 + ":00" : time + ":00";
    console.log(time);
    const datetime = new Date(date + " " + time);
    return datetime;
  };

  const getEmptyTables = _ => {
    let tables = totalTables.filter((table, index) => table.isAvailable);
    return tables.length;
  };

  useEffect(() => {
    // Check availability of tables from DB when a date and time is selected
    if (selection.time && selection.date) {
      try {
        (async _ => {
          let datetime = getDate();
          let res = await fetch("http://localhost:3005/availability", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              date: datetime
            })
          });
          res = await res.json();
          // Filter available tables with location and group size criteria
          let tables = res.tables.filter(
            table =>
              (selection.size > 0 ? table.capacity >= selection.size : true) &&
              (selection.location !== "Local"
                ? table.location === selection.location
                : true)
          );
          setTotalTables(tables);
        })();
      } catch (error) {
        setReservationError("Unable to search for seats")
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection.time, selection.date, selection.size, selection.location]);

  // Make the reservation if all details are filled out
  const reserve = async _ => {
    if (
      (booking.name.length === 0) |
      (booking.phone.length === 0) |
      (booking.email.length === 0)
    ) {
      // console.log("Incomplete Details");
      setReservationError("Incomplete Details");
    } else {
      try {
        const datetime = getDate();
        let res = await fetch("http://localhost:3005/reserve", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            ...booking,
            date: datetime,
            table: selection.table.id
          })
        });
        await res.text();
        goToTankYou(navigate);
        
      } catch (error) {
        setReservationError("Unable to reserve seats")
      }
    }
  };

  // Clicking on a table sets the selection state
  const selectTable = (table_name, table_id) => {
    setSelection({
      ...selection,
      table: {
        name: table_name,
        id: table_id
      }
    });
  };

  // Generate party size dropdown
  const getSizes = _ => {
    let newSizes = [];

    for (let i = 1; i < 8; i++) {
      newSizes.push(
        <DropdownItem
          key={i}
          className="booking-dropdown-item"
          onClick={e => {
            let newSel = {
              ...selection,
              table: {
                ...selection.table
              },
              size: i
            };
            setSelection(newSel);
          }}
        >
          {i}
        </DropdownItem>
      );
    }
    return newSizes;
  };

  // Generate locations dropdown
  const getLocations = _ => {
    let newLocations = [];
    locations.forEach(loc => {
      newLocations.push(
        <DropdownItem
          key={loc}
          className="booking-dropdown-item"
          onClick={_ => {
            let newSel = {
              ...selection,
              table: {
                ...selection.table
              },
              location: loc
            };
            setSelection(newSel);
          }}
        >
          {loc}
        </DropdownItem>
      );
    });
    return newLocations;
  };

  // Generate locations dropdown
  const getTimes = _ => {
    let newTimes = [];
    times.forEach(time => {
      newTimes.push(
        <DropdownItem
          key={time}
          className="booking-dropdown-item"
          onClick={_ => {
            let newSel = {
              ...selection,
              table: {
                ...selection.table
              },
              time: time
            };
            setSelection(newSel);
          }}
        >
          {time}
        </DropdownItem>
      );
    });
    return newTimes;
  };

  // Generating tables from available tables state
  const getTables = _ => {
    console.log("Getting tables");
    if (getEmptyTables() > 0) {
      let tables = [];
      totalTables.forEach(table => {
        const reservedSeatsTotal = table.reservations.reduce((prev, reser) => !reser.cancel ? reser.reservedSeats + prev : prev, 0)
        tables.push(
          <Table
            key={table._id}
            id={table._id}
            chairs={table.capacity}
            name={table.name}
            reservedSeatsTotal={reservedSeatsTotal}
            selectTable={selectTable}
            selectionSize={selection.size}
          />
        );

      });
      return tables;
    }
  };

  return (
    <>
      <Row noGutters className="text-center align-items-center ">
        <Col>
          <p className="looking-for-seats-book">
            {!selection.table.id ? "Procure por seu assento" : "Confirme seus dados"}
            <i
              className={
                !selection.table.id
                  ? "fas fa-chair seats"
                  : "fas fa-clipboard-check seats"
              }
            ></i>
          </p>
          <p className="selected-table">
            {selection.table.id
              ? "Você está reservando o " + selection.table.name
              : null}
          </p>

          {reservationError ? (
            <p className="reservation-error">
            {reservationError}
            </p>
          ) : null}
        </Col>
      </Row>

      {!selection.table.id ? (
        <div id="reservation-stuff">
          <Row noGutters className="text-center align-items-center">
            <Col xs="12" sm="3">
              <input
                type="date"
                required="required"
                className="booking-dropdown"
                value={selection.date.toISOString().split("T")[0]}
                onChange={e => {
                  if (!isNaN(new Date(new Date(e.target.value)))) {
                    let newSel = {
                      ...selection,
                      table: {
                        ...selection.table
                      },
                      date: new Date(e.target.value)
                    };
                    setSelection(newSel);
                  } else {
                    console.log("Invalid date");
                    let newSel = {
                      ...selection,
                      table: {
                        ...selection.table
                      },
                      date: new Date()
                    };
                    setSelection(newSel);
                  }
                }}
              ></input>
            </Col>
            <Col xs="12" sm="3">
              <UncontrolledDropdown>
                <DropdownToggle color="none" caret className="booking-dropdown">
                  {selection.time === null ? "Selecione um horário" : selection.time}
                </DropdownToggle>
                <DropdownMenu right className="booking-dropdown-menu">
                  {getTimes()}
                </DropdownMenu>
              </UncontrolledDropdown>
            </Col>
            <Col xs="12" sm="3">
              <UncontrolledDropdown>
                <DropdownToggle color="none" caret className="booking-dropdown">
                  {selection.location}
                </DropdownToggle>
                <DropdownMenu right className="booking-dropdown-menu">
                  {getLocations()}
                </DropdownMenu>
              </UncontrolledDropdown>
            </Col>
            <Col xs="12" sm="3">
              <UncontrolledDropdown>
                <DropdownToggle color="none" caret className="booking-dropdown">
                  {selection.size === 0
                    ? "Número de passageiros"
                    : selection.size.toString()}
                </DropdownToggle>
                <DropdownMenu right className="booking-dropdown-menu">
                  {getSizes()}
                </DropdownMenu>
              </UncontrolledDropdown>
            </Col>
          </Row>
          <Row noGutters className="tables-display">
            <Col>
              {getEmptyTables() > 0 ? (
                <p className="available-tables">{getEmptyTables()} available</p>
              ) : null}

              {selection.date && selection.time ? (
                getEmptyTables() > 0 ? (
                  <div>
                    <div className="table-key">
                      <span className="empty-table"></span> &nbsp; Available
                      &nbsp;&nbsp;
                      <span className="full-table"></span> &nbsp; Unavailable
                      &nbsp;&nbsp;
                    </div>
                    <Row noGutters>{getTables()}</Row>
                  </div>
                ) : (
                  <p className="table-display-message">Sem reservas disponíveis </p>
                )
              ) : (
                <p className="table-display-message">
                  Selecione uma data e um horário para a sua reserva
                </p>
              )}
            </Col>
          </Row>
        </div>
      ) : (
        <div id="confirm-reservation-stuff">
          <Row
            noGutters
            className="text-center justify-content-center reservation-details-container"
          >
            <Col xs="12" sm="3" className="reservation-details">
              <Input
                type="text"
                bsSize="lg"
                placeholder="Nome"
                className="reservation-input"
                value={booking.name}
                onChange={e => {
                  setBooking({
                    ...booking,
                    name: e.target.value
                  });
                }}
              />
            </Col>
            <Col xs="12" sm="3" className="reservation-details">
              <Input
                type="text"
                bsSize="lg"
                placeholder="Número de telefone"
                className="reservation-input"
                value={booking.phone}
                onChange={e => {
                  setBooking({
                    ...booking,
                    phone: e.target.value
                  });
                }}
              />
            </Col>
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
          <Row noGutters className="text-center">
            <Col>
              <Button
                color="none"
                className="book-table-btn"
                onClick={_ => {
                  reserve();
                }}
              >
                Finalizar reserva
              </Button>
            </Col>
          </Row>
        </div>
      )}
    </>
  );
};
