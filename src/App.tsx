import React, { useState } from "react";
import "./assets/css/App.css"

import Canva from "./components/Canva"

import { getDoc, getFirestore, doc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { firebaseConfig } from "./assets/settings";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.useDeviceLanguage()
const db = getFirestore(app)

const App = () => {

  const [canvaData, setCanvaData] = useState([])

  async function getCanvaData() {
    const canvaData = await getDoc(doc(db, "/place-grid/GRID_DATA"))
    const canvaDataString = canvaData.data().pixelsDataToString

    setCanvaData(JSON.parse(canvaDataString))
  }

  React.useEffect(() => {
    getCanvaData()
  }, [])


  if (canvaData.length == 0) return null

  return (
    <div className="main-container">
      <Canva canvaData={canvaData} />
    </div>
  );
};

export default App;