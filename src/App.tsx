import React from "react";
import "./assets/css/App.css"

import Canva from "./components/Canva"

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { firebaseConfig } from "./assets/settings";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.useDeviceLanguage()

const App = () => {


  return (
    <div className="main-container">
      <Canva />
    </div>
  );
};

export default App;