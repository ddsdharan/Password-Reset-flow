import { Route, Routes, Navigate, BrowserRouter } from "react-router-dom";
import "./App.css";
import { Register } from "./components/register/Register";
import { Login } from "./components/login/Login.js";
import { NotFound } from "./components/pageNotFound/NotFound";
import { ForgetPassword } from "./components/forgetPassword/ForgetPassword";
import { ChangePassword } from "./components/forgetPassword/ChangePassword";
import { Home } from "./components/homePage/Home"
import React from "react";
import { Appstate } from "./contexts/AppState";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Appstate>
          <Routes>
            <Route path="/Register" element={<Register />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/ForgetPassword" element={<ForgetPassword />} />
            <Route path="/" element={<Navigate replace to="/Login" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/404-Page" element={<NotFound />} />
            <Route path="*" element={<Navigate replace to="/404-Page" />} />
            <Route path="/reset-password/:id/:token" element={<ChangePassword />} />
          </Routes>
        </Appstate>
      </BrowserRouter>
    </div>
  );
}

export default App;
