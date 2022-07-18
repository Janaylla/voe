import React from "react";
import { Row, Col } from "reactstrap";

const TankYou = () => {
  return (
    <div>
      <Row noGutters className="text-center">
        <Col>
          <p className="thanks-header">Obrigado!</p>
          <i className="fas fa-assento thank-you-assento"></i>
          <p className="thanks-subtext">
            Confira o seu email com a confirmação da sua reserva
          </p>
        </Col>
      </Row>
    </div>
  );
};

export default TankYou