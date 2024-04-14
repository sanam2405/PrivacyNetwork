/* eslint-disable @typescript-eslint/no-var-requires */
import "./App.css";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Signup from "./components/Signup";
import Login from "./components/Login";
import FriendsPage from "./components/FriendsPage";
import Client from "./components/Client";
import LogoutModal from "./components/LogoutModal";
import { LoginContext } from "./context/LoginContext";
import { Socket } from "./components/Socket";
// import 'dotenv/config';

// require('dotenv').config()

// const GOOGLE_CLIENT: string | undefined = process.env.GOOGLE_CLIENT

// GOOGLE_CLIENT is disabled for now, need to fix this later
const GOOGLE_CLIENT: string | undefined = undefined;

function App() {
  const [userLogin, setUserLogin] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  return (
    <div className="App">
      {GOOGLE_CLIENT ? (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT}>
          <LoginContext.Provider
            value={{ setUserLogin, setModalOpen, userLogin }}
          >
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/friendsPage" element={<FriendsPage />} />
                <Route path="/client" element={<Client />} />
              </Routes>
            </BrowserRouter>
            {modalOpen ? <LogoutModal /> : ""}
          </LoginContext.Provider>
        </GoogleOAuthProvider>
      ) : (
        <LoginContext.Provider
          value={{ setUserLogin, setModalOpen, userLogin }}
        >
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/friendsPage" element={<FriendsPage />} />
              <Route path="/client" element={<Client />} />
              <Route path="/socket" element={<Socket />} />
            </Routes>
          </BrowserRouter>
          {modalOpen ? <LogoutModal /> : ""}
        </LoginContext.Provider>
      )}
    </div>
  );
}

export default App;
