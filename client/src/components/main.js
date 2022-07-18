import React from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Button } from "reactstrap";
import { goToBook } from "../route/coordinator";

export default function Main(){
  const navigate = useNavigate()
  return (
      <Row noGutters className="text-center align-items-center seats-cta">
        <Col>
          <img
            src={require("../images/aviao.png")}
            alt="cafe"
            className="big-img"
          />
        </Col>
        <Col className="seat-reserved">
            <span className="looking-for-seats">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum viverra felis lorem. Duis posuere laoreet libero, ac auctor nisl congue nec. Maecenas iaculis non erat sed fringilla. Vestibulum eget finibus diam, vitae dictum metus. Maecenas hendrerit urna turpis, ac hendrerit risus molestie sed. Praesent auctor faucibus venenatis. Aliquam gravida sed odio sit amet feugiat.
            </span>
          <p className="looking-for-seats">
            Voe diretamente com a Dio 
            <i className="fas fa-seats seats-slice"></i>
          </p>
          <Button
            color="none"
            className="book-table-btn"
            onClick={() => goToBook(navigate)}
          >
            Reserve já
          </Button>
        </Col>
      </Row>
  );
};
