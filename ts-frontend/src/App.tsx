/* eslint-disable @typescript-eslint/no-var-requires */
import "./App.css";
import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import FriendsPage from "./pages/FriendsPage";
import Client from "./pages/Client";
import LogoutModal from "./components/LogoutModal";
import { LoginContext } from "./context/LoginContext";
import { Socket } from "./components/Socket";
import { Feed } from "./pages/Feed";
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
                <Route path="/auth" element={<Login />} />
                <Route path="/dashboard" element={<FriendsPage />} />
                <Route path="/feed" element={<Feed />} />
                <Route path="/map" element={<Client />} />
                {/* <Route path="/socket" element={<Socket />} /> */}
                <Route path="*" element={<Navigate to="/auth" />} />
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
              <Route path="/auth" element={<Login />} />
              <Route path="/dashboard" element={<FriendsPage />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/map" element={<Client />} />
              {/* <Route path="/socket" element={<Socket />} /> */}
              <Route path="*" element={<Navigate to="/auth" />} />
            </Routes>
          </BrowserRouter>
          {modalOpen ? <LogoutModal /> : ""}
        </LoginContext.Provider>
      )}
    </div>
  );
}

export default App;
