/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { Row, Col } from "reactstrap";

export default props => {
  const getRow1 = _ => {
    let chairs = [];
    for (let i = 0; i < Math.ceil(props.chairs / 2); i++) {
      chairs.push(
        <span
          key={i}
          className={props.reservedSeatsTotal <= i ? "empty-table" : "full-table"}
        ></span>
      );
    }
    return chairs;
  };
  const getRow2 = _ => {
    let chairs2 = [];
    const row1Chair = Math.ceil(props.chairs / 2)
    for (let i = 0; i < Math.floor(props.chairs / 2); i++) {
      chairs2.push(
        <span
          key={i}
          className={props.reservedSeatsTotal  <= i + row1Chair ? "empty-table" : "full-table"}
        ></span>
      );
    }
    return chairs2;
  };
  const havePlace = props.chairs - props.reservedSeatsTotal >= props.selectionSize
  return (
    <div className="table-container">
      <Col
        className={havePlace? "table selectable-table" : "table"}
        onClick={_ => {
          havePlace
            ? props.selectTable(props.name, props.id)
            : alert("Tried to select a full table");
        }}
      >
        <Row noGutters className="table-row">
          <Col className="text-center">{getRow1()}</Col>
        </Row>
        <Row noGutters className="table-row">
          <Col className="text-center">{getRow2()}</Col>
        </Row>

        <p className="text-center table-name">{props.name}</p>
      </Col>
    </div>
  );
};
