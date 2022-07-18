import { BrowserRouter, Routes, Route } from "react-router-dom";
import Book from "../components/book";
import Main from "../components/main";
import MyReservations from "../components/myReservations";
import Navbar from "../components/navbar";
import TankYou from "../components/thankYou";

export function Router() {
  return (
    <BrowserRouter >
      <Navbar />
      <Routes >
        <Route index element={<Main />} />
        <Route path="book" element={<Book />} />
        <Route path="my-reservations" element={<MyReservations />} />
        <Route path="tankyou" element={<TankYou />} />
      </Routes>
    </BrowserRouter>
  );
}
