import React from "react";
import "./assets/css/App.css"

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { firebaseConfig } from "./assets/settings";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.useDeviceLanguage()

const App = () => {


  return (
    <div className="main-container">

    </div>
  );
};

export default App;