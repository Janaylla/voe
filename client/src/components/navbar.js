/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, NavbarBrand } from "reactstrap";
import { goToBook, goToHome, goToMyReservation } from "../route/coordinator";

export default _ => {
  const navigate = useNavigate()
  return (
      <Navbar className="nav" >
        <NavbarBrand
          className="nav-brand"
          onClick={() =>  goToHome(navigate)}
        >
         Home
        </NavbarBrand>
        <NavbarBrand
          className="nav-brand"
          onClick={() =>  goToBook(navigate)}
        >
         Reseve já
        </NavbarBrand>
        <NavbarBrand
          className="nav-brand"
          onClick={() =>  goToMyReservation(navigate)}
        >
          Minhas reservas
        </NavbarBrand>
      </Navbar>
  );
};
