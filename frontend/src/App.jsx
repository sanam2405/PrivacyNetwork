import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import FriendsPage from "./FriendsPage";
import Client from "./Client";
import { LoginContext } from "./context/LoginContext";
import { GoogleOAuthProvider } from '@react-oauth/google';


const App = () => {
  const [userLogin, setUserLogin] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="App">
      <GoogleOAuthProvider clientId="914751995071-333ch7m1495282l7ne9p2hbjgdk7ia4j.apps.googleusercontent.com">
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
