import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import FriendsPage from "./components/FriendsPage";
import Client from "./components/Client";
import { LoginContext } from "./context/LoginContext";
import { GoogleOAuthProvider } from '@react-oauth/google';
require("dotenv").config();

const GOOGLE_CLIENT = process.env.GOOGLE_CLIENT;

const App = () => {
  const [userLogin, setUserLogin] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="App">
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT}>
        <LoginContext.Provider value={{ setUserLogin, setModalOpen, userLogin }}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/friendsPage" element={<FriendsPage />} />
              <Route path="/client" element={<Client />} />
            </Routes>
          </BrowserRouter>
        </LoginContext.Provider>
      </GoogleOAuthProvider>
    </div>
  );
};

export default App;
