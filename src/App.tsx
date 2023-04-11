import React, { useState } from "react";
import "./assets/css/App.css"

import Canva from "./components/Canva"

import { getDoc, getFirestore, doc, query, collection, orderBy, limit, onSnapshot } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { firebaseConfig } from "./assets/settings";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.useDeviceLanguage()
const db = getFirestore(app)

const App = () => {

  const [canvaData, setCanvaData] = useState([])
  const [newPixels, setNewPixels] = useState([])

  async function getCanvaData() {
    const canvaData = await getDoc(doc(db, "/place-grid/GRID_DATA"))
    const canvaDataString = canvaData.data().pixelsDataToString

    setCanvaData(JSON.parse(canvaDataString))
  }

  React.useEffect(() => {
    getCanvaData()

    const lastPixelPlaced = query(
      collection(db, "grid-history"),
      orderBy("editedAt", "desc"),
      limit(1)
    )

    const unsubscribe = onSnapshot(lastPixelPlaced, (QuerySnapshot) => {
      let newPixels: any[] = [];
      QuerySnapshot.forEach((doc) => {
        newPixels.push({ ...doc.data(), id: doc.id });
      });
      setNewPixels((cNewPixels) => [
        ...cNewPixels,
        ...newPixels
      ]);
    });

    return unsubscribe;
  }, [])


  if (canvaData.length == 0) return null

  return (
    <div className="main-container">
      <Canva canvaData={canvaData} newPixels={newPixels} setNewPixels={setNewPixels} />
    </div>
  );
};

export default App;