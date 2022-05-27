import { useState, useEffect } from "react";
import InputPanel from "./InputPanel"
import ListPanel from "./ListPanel"

export default function App() {

  /*  Entries in the list have the form:
      { id: number, description: string, secondsCount: number }  */
  const [entriesList, setEntriesList] = useState([])

  return (
    <>
      <h1>Time Tracker Application</h1>
      < InputPanel
        entriesList={entriesList}
        setEntriesList={setEntriesList} />
    </>
  );
}